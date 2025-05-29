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

ServiceSchema.set("toJSON", { versionKey: false });
ServiceSchema.set("toObject", { versionKey: false });

const service = mongoose.model("service", ServiceSchema, "dichvu");

module.exports = service;