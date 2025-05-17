const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    TenDV: {
        type: String,
        required: true,
    },
    GiaDV: {
        type: Number,
        required: true,
    },
    MoTa: {
        type: String,
        required: true,
    },
    HinhAnh: {
        type: String,
        required: true,
    },
});

let service = mongoose.model("service", ServiceSchema, "dichvu");

module.exports = service;