const mongoose = require("mongoose");

const SearchLogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
    keyword: {
      type: String,
      required: true,
      trim: true,
    },
    normalized_keyword: { type: String }, // <-- Thêm dòng này
    type: {
      type: String,
      enum: ["room", "feature", "service", "auto"],
      default: "auto",
    },
  },
  { timestamps: true }
);

const SearchLog = mongoose.model("search_log", SearchLogSchema, "search_log");
module.exports = SearchLog;
