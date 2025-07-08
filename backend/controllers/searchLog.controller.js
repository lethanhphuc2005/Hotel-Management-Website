const SearchLog = require("../models/searchLog.model");
const removeVietnameseTones = require("../utils/removeVietnameseTones"); // bạn sẽ tạo file này

const saveSearchLog = async (req, res) => {
  try {
    const { keyword, type = "auto" } = req.body;
    const user_id = req.user?.id;

    if (!keyword || keyword.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Keyword is required" });
    }

    const normalized = removeVietnameseTones(keyword.trim().toLowerCase());

    await SearchLog.create({
      user_id,
      keyword: normalized,
      normalized_keyword: keyword.trim(), // lưu thêm bản gốc
      type,
    });

    res.json({ success: true, message: "Search log saved" });
  } catch (err) {
    console.error("saveSearchLog:", err);
    res.status(500).json({ success: false, message: "Internal error" });
  }
};

// GET /api/search-log/history
const getSearchHistory = async (req, res) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) return res.json({ success: true, data: [] });

    const logs = await SearchLog.find({ user_id })
      .sort({ created_at: -1 })
      .limit(10);

    const keywords = [...new Set(logs.map((log) => log.keyword))];

    res.json({ success: true, data: keywords });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal error" });
  }
};

// GET /api/search-log/trending
const getTrendingKeywords = async (req, res) => {
  try {
    const result = await SearchLog.aggregate([
      {
        $group: {
          _id: "$keyword",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Đổi từ trường "keyword" → dùng `original` để hiển thị từ khóa người dùng nhập thật
    const trending = result.map((r) => ({
      keyword: r._id, // là normalized
      count: r.count,
    }));

    res.json({ success: true, data: trending });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal error" });
  }
};

// GET /api/search-log/ai-keywords
const getKeywordsForAI = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const logs = await SearchLog.find({
      created_at: { $gte: thirtyDaysAgo },
    }).select("normalized");

    const keywords = logs.map((log) => log.normalized);

    res.json({ success: true, data: keywords });
  } catch (err) {
    console.error("getKeywordsForAI error:", err);
    res.status(500).json({ success: false, message: "Internal error" });
  }
};

module.exports = {
  saveSearchLog,
  getSearchHistory,
  getTrendingKeywords,
  getKeywordsForAI,
};
