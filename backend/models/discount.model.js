const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: [
        "early_bird",
        "last_minute",
        "length_of_stay",
        "promo_code",
        "seasonal",
        "multi_room",
        "user_level",
      ],
      required: true,
    },
    value: { type: Number, required: true },
    valueType: { type: String, enum: ["percent", "fixed"], default: "percent" },
    promoCode: { type: String, default: null },
    conditions: {
      minAdvanceDays: Number,
      maxAdvanceDays: Number,
      minStayNights: Number,
      maxStayNights: Number,
      minRooms: Number,
      userLevels: [String],
    },
    validFrom: Date,
    validTo: Date,
    applyToRoomClassIds: [mongoose.Schema.Types.ObjectId],
    canBeStacked: { type: Boolean, default: false },
    priority: { type: Number, default: 1 },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

DiscountSchema.set("toJSON", {
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id; // Chuyển đổi ObjectId thành chuỗi
    delete ret._id;
    return ret;
  },
});

const Discount = mongoose.model("discount", DiscountSchema, "discount");
module.exports = Discount;
