const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["refund", "use", "bonus", "deposit"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  note: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const WalletSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    transactions: [TransactionSchema],
  },
  { timestamps: true }
);

WalletSchema.virtual("user", {
  ref: "user",
  localField: "user_id",
  foreignField: "_id",
  justOne: true, // Chỉ lấy một đối tượng
  options: {
    select: "first_name last_name email phone_number", // Chọn các trường cần thiết
  },
});

TransactionSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

WalletSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const Wallet = mongoose.model("wallet", WalletSchema, "wallet");

module.exports = Wallet;
