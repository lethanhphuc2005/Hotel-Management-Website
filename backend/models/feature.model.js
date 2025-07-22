const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema(
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
    image: {
      type: String,
      default: "",
      trim: true,
      maxlength: 255,
    },
    icon: {
      type: String,
      default: "",
      trim: true,
      maxlength: 255,
    },
    status: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

FeatureSchema.virtual("room_class_used_list", {
  ref: "room_class_feature",
  localField: "_id",
  foreignField: "feature_id",
});

FeatureSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id; // Chuyển đổi ObjectId thành chuỗi
    delete ret._id;
    return ret;
  },
});

const Room_Class_FeatureSchema = new mongoose.Schema(
  {
    room_class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room_class",
      required: true,
    },
    feature_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "feature",
      required: true,
    },
  },
  { timestamps: true }
);

Room_Class_FeatureSchema.virtual("room_class", {
  ref: "room_class",
  localField: "room_class_id",
  foreignField: "_id",
  justOne: true,
  options: {
    select: "name description status",
  },
});

Room_Class_FeatureSchema.virtual("feature", {
  ref: "feature",
  localField: "feature_id",
  foreignField: "_id",
  justOne: true,
  options: {
    select: "name description image icon status",
  },
});

Room_Class_FeatureSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id; // Chuyển đổi ObjectId thành chuỗi
    delete ret._id;
    return ret;
  },
});

const Feature = mongoose.model("feature", FeatureSchema, "feature");
const Room_Class_Feature = mongoose.model(
  "room_class_feature",
  Room_Class_FeatureSchema,
  "room_class_feature"
);

module.exports = {
  Feature,
  Room_Class_Feature,
};
