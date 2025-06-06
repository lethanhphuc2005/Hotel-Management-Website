const mongoose = require("mongoose");

const BookingDetailSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "booking",
    required: true,
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "room",
    required: true,
  },
  price_per_night: {
    type: Number,
    required: true,
    min: 0,
  },
  nights: {
    type: Number,
    required: true,
    min: 1,
  },
});

BookingDetailSchema.virtual("room", {
  ref: "room",
  localField: "room_id",
  foreignField: "_id",
});

BookingDetailSchema.virtual("booking", {
  ref: "booking",
  localField: "booking_id",
  foreignField: "_id",
});

BookingDetailSchema.virtual("services", {
  ref: "booking_detail_service",
  localField: "_id",
  foreignField: "booking_detail_id",
});

BookingDetailSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id;
    return ret;
  },
});

const Booking_Detail_ServiceSchema = new mongoose.Schema({
  booking_detail_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "booking_detail",
    required: true,
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "service",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  used_at: {
    type: Date,
    default: Date.now,
  },
});

Booking_Detail_ServiceSchema.virtual("booking_detail", {
  ref: "booking_detail",
  localField: "booking_detail_id",
  foreignField: "_id",
});

Booking_Detail_ServiceSchema.virtual("service", {
  ref: "service",
  localField: "service_id",
  foreignField: "_id",
});

Booking_Detail_ServiceSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id;
    return ret;
  },
});

const BookingDetail = mongoose.model(
  "booking_detail",
  BookingDetailSchema,
  "booking_detail"
);

const Booking_Detail_Service = mongoose.model(
  "booking_detail_service",
  Booking_Detail_ServiceSchema,
  "booking_detail_service"
);

module.exports = {
  BookingDetail,
  Booking_Detail_Service,
};
