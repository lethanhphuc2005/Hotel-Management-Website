const Fuse = require("fuse.js");
const RoomClass = require("../models/roomClass.model");
const { Feature } = require("../models/feature.model");
const Service = require("../models/service.model");
const removeVietnameseTones = require("../utils/removeVietnameseTones");

const suggestionController = {
  getSuggestions: async (req, res) => {
    const q = req.query.q?.trim() || "";
    const MAX_RESULTS = 10;

    try {
      const [roomClasses, features, services] = await Promise.all([
        RoomClass.find({ status: true }).select("name"),
        Feature.find({ status: true }).select("name"),
        Service.find({ status: true }).select("name"),
      ]);

      // Gộp tất cả vào 1 mảng
      const suggestions = [
        ...roomClasses.map((r) => ({ type: "room", label: r.name, id: r._id })),
        ...features.map((f) => ({ type: "feature", label: f.name, id: f._id })),
        ...services.map((s) => ({ type: "service", label: s.name, id: s._id })),
      ];

      if (!q) {
        return res.json(suggestions.slice(0, MAX_RESULTS));
      }

      // Dùng fuzzy search để tìm gần đúng
      const fuse = new Fuse(suggestions, {
        keys: ["label"],
        threshold: 0.3,
      });

      const result = fuse.search(q).map((r) => r.item);

      // Loại trùng
      const unique = [];
      const seen = new Set();
      for (const s of result) {
        if (!seen.has(s.label.toLowerCase())) {
          seen.add(s.label.toLowerCase());
          unique.push(s);
        }
        if (unique.length >= MAX_RESULTS) break;
      }

      return res.json(unique);
    } catch (err) {
      console.error("Error in getSuggestions:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  getSuggestionsByKeyword: async (req, res) => {
    try {
      const { type, query } = req.query;

      if (type !== "keyword") {
        return res
          .status(400)
          .json({ success: false, message: "Missing type=keyword" });
      }

      const rawQuery = query.trim();
      const normalizedQuery = removeVietnameseTones(rawQuery);

      const [roomClasses, services, features] = await Promise.all([
        RoomClass.find({ status: true }).populate("images"),
        Service.find({ status: true }),
        Feature.find({ status: true }),
      ]);

      // === Tạo Fuse options ===
      const fuseOptions = {
        keys: ["name", "description"],
        includeScore: true,
        threshold: 0.4,
        ignoreLocation: true,
        useExtendedSearch: true,

        getFn: (obj, path) => {
          const value = obj[path] || "";
          return removeVietnameseTones(value);
        },
      };

      // === Tìm kiếm fuzzy từng loại ===
      const roomClassResults = new Fuse(roomClasses, fuseOptions).search(
        normalizedQuery
      );
      const serviceResults = new Fuse(services, fuseOptions).search(
        normalizedQuery
      );
      const featureResults = new Fuse(features, fuseOptions).search(
        normalizedQuery
      );

      return res.json({
        success: true,
        data: {
          roomClasses: roomClassResults.map((r) => r.item),
          services: serviceResults.map((r) => r.item),
          features: featureResults.map((r) => r.item),
        },
      });
    } catch (err) {
      console.error("Search keyword error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
};

module.exports = suggestionController;
