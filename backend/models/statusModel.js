const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema(
  {
    TenTT: {
      type: String,
      required: true,
      maxlength: 100,
    },
    LoaiTT: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const StatusModel = mongoose.model("status", StatusSchema, "trangthai");

module.exports = StatusModel;
