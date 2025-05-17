const mongoose = require("mongoose");

const WebsiteContentSchema = new mongoose.Schema({
    TieuDe: {
        type: String,
        required: true,
    },
    NoiDung: {
        type: String,
        required: true,
    },
    MaND: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contenttype', // nếu bạn có model người dùng
        required: true,
    },
    NgayDang: {
        type: Date,
        default: Date.now,
    },
    HinhAnh: {
        type: String, // ví dụ: "banner1.webp"
        required: true,
    },
});

let websitecontent = mongoose.model("websitecontent", WebsiteContentSchema, "noidung_website");

module.exports = websitecontent;