const mongoose = require("mongoose");

const WebsiteContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "",
      maxlength: 100,
    },
    content: {
      type: String,
      trim: true,
      default: "",
      maxlength: 5000,
    },
    content_type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "content_type",
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

WebsiteContentSchema.virtual("image", {
  ref: "image",
  localField: "_id",
  foreignField: "target_id",
  match: { target: "website_content", status: true }, // Chỉ lấy ảnh có trạng thái hợp lệ
  justOne: true,
  options: {
    select: "url public_id",
  },
});

WebsiteContentSchema.virtual("content_type", {
  ref: "content_type",
  localField: "content_type_id",
  foreignField: "_id",
  match: { status: true }, // Chỉ lấy loại nội dung hợp lệ
  justOne: true, // Chỉ lấy một đối tượng
  options: {
    select: "name description", // Chọn các trường cần thiết
  },
});

WebsiteContentSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id; // Chuyển đổi ObjectId thành chuỗi
    delete ret._id;
    return ret;
  },
});

const WebsiteContent = mongoose.model(
  "website_content",
  WebsiteContentSchema,
  "website_content"
);

module.exports = WebsiteContent;
