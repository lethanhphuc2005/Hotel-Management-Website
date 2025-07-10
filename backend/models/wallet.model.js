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
  created_at: {
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
