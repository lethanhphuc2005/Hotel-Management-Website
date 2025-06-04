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

RoomStatusSchema.set("toJSON", {
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
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

BookingStatusSchema.set("toJSON", {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id;
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
