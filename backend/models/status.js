const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
    TenTT: {
        type: String,
        required: true,
    },
    LoaiTT: {
        type: String,
        required: true,
    }
});

let status = mongoose.model("status", StatusSchema, "trangthai");

module.exports = status;