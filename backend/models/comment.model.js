const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    room_class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room_class",
      required: true,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
      default: null,
    },
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
      default: null,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500, // Giới hạn độ dài nội dung bình luận
    },
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

CommentSchema.virtual("employee", {
  ref: "employee",
  localField: "employee_id",
  foreignField: "_id",
  justOne: true,
  options: {
    select: "first_name last_name email phone_number",
  },
});

CommentSchema.virtual("user", {
  ref: "user",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
  options: {
    select: "first_name last_name email phone_number",
  },
});

CommentSchema.virtual("room_class", {
  ref: "room_class",
  localField: "room_class_id",
  foreignField: "_id",
  justOne: true,
  options: {
    select: "name description status",
    path: "images"
  },
});

CommentSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id; // Chuyển đổi ObjectId thành chuỗi
    delete ret._id;
    return ret;
  },
});

const Comment = mongoose.model("comment", CommentSchema, "comment");

module.exports = Comment;
