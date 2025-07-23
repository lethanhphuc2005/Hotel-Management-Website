const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, default: "" },
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
    value_type: {
      type: String,
      enum: ["percent", "fixed"],
      default: "percent",
    },
    promo_code: { type: String, default: null },
    conditions: {
      min_advance_days: Number,
      max_advance_days: Number,
      min_stay_nights: Number,
      max_stay_nights: Number,
      min_rooms: Number,
      user_levels: [String],
    },
    valid_from: Date,
    valid_to: Date,
    apply_to_room_class_ids: [mongoose.Schema.Types.ObjectId],
    can_be_stacked: { type: Boolean, default: false },
    priority: { type: Number, default: 1 },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

DiscountSchema.virtual("booking_count", {
  ref: "booking",
  localField: "_id",
  foreignField: "discount_id",
  count: true,
});

DiscountSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id; // Chuyển đổi ObjectId thành chuỗi
    delete ret._id;
    return ret;
  },
});

const Discount = mongoose.model("discount", DiscountSchema, "discount");
module.exports = Discount;
