const mongoose = require("mongoose");

const ContentTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "",
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    status: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

ContentTypeSchema.virtual("website_content_list", {
  ref: "website_content",
  localField: "_id",
  foreignField: "content_type_id",
  justOne: false,
  options: {
    select: "title content status createdAt updatedAt",
  },
});

ContentTypeSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id; // Chuyển đổi ObjectId thành chuỗi
    delete ret._id;
    return ret;
  },
});

const ContentType = mongoose.model(
  "content_type",
  ContentTypeSchema,
  "content_type"
);

module.exports = ContentType;
