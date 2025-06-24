const mongoose = require("mongoose");

const RoomStatusSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
      default: "",
      trim: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

RoomStatusSchema.virtual("rooms", {
  ref: "room",
  localField: "_id",
  foreignField: "room_status_id",
});

RoomStatusSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id;
    return ret;
  },
});

const BookingStatusSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
      default: "",
      trim: true,
    },
    code: {
      type: String,
      required: true,
      maxlength: 10,
      default: "",
      trim: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

BookingStatusSchema.virtual("bookings", {
  ref: "booking",
  localField: "_id",
  foreignField: "booking_status_id",
});

BookingStatusSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  },
});

const RoomStatus = mongoose.model(
  "room_status",
  RoomStatusSchema,
  "room_status"
);
const BookingStatus = mongoose.model(
  "booking_status",
  BookingStatusSchema,
  "booking_status"
);

module.exports = {
  RoomStatus,
  BookingStatus,
};
