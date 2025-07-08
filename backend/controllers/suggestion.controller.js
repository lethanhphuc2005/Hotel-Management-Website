const Fuse = require("fuse.js");
const RoomClass = require("../models/roomClass.model");
const { Feature } = require("../models/feature.model");
const Service = require("../models/service.model");

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
        threshold: 0.4,
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
};

module.exports = suggestionController;