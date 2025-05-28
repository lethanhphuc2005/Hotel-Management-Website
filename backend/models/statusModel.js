const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
    TenTT: {
        type: String,
        required: true,
        maxlength: 100,
        
    },
    LoaiTT: {
        type: String,
        required: true,
    }
});

const statusModel = mongoose.model("status", StatusSchema, "trangthai");

module.exports = statusModel;