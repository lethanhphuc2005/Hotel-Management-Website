const ImageModel = require("../models/imageModel");

const imageCon = {
  // === KIỂM TRA ĐIỀU KIỆN HÌNH ẢNH ===
  validateImage: (imageData, imageId) => {
    const { HinhAnh, MaLP, Loai } = imageData;
    if (!HinhAnh || !MaLP || !Loai) {
      return {
        valid: false,
        message: "Thông tin hình ảnh không được để trống",
      };
    }

    if (typeof HinhAnh !== "string" || typeof Loai !== "string") {
      return {
        valid: false,
        message: "Thông tin hình ảnh phải là chuỗi",
      };
    }

    if (Loai !== "roomTypeMain" && Loai !== "roomType") {
      return {
        valid: false,
        message: "Loại hình ảnh không hợp lệ",
      };
    }

    return { valid: true };
  },

  // === LẤY TẤT CẢ HÌNH ẢNH ===
  getAllImages: async (req, res) => {
    try {
      const images = await ImageModel.find()
        .populate([{ path: "MaLP" }])
        .exec();
      if (!images || images.length === 0) {
        return res.status(404).json({ message: "Không có hình ảnh nào" });
      }
      res.status(200).json({
        message: "Lấy tất cả hình ảnh thành công",
        data: images,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === LẤY TẤT CẢ HÌNH ẢNH CHO USER ===
  getAllImagesForUser: async (req, res) => {
    try {
      const images = await ImageModel.find({ TrangThai: true })
        .select("-TrangThai")
        .populate([
          {
            path: "MaLP",
            match: { TrangThai: true },
            select: "-TrangThai",
          },
        ])
        .exec();
      if (!images || images.length === 0) {
        return res.status(404).json({ message: "Không có hình ảnh nào" });
      }
      res.status(200).json({
        message: "Lấy tất cả hình ảnh thành công",
        data: images,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === LẤY HÌNH ẢNH THEO ID ===
  getImageById: async (req, res) => {
    try {
      const imageData = await ImageModel.findById(req.params.id)
        .populate([{ path: "MaLP" }])
        .exec();
      if (!imageData) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy hình ảnh loại phòng" });
      }
      res.status(200).json({
        message: "Lấy hình ảnh thành công",
        data: imageData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === THÊM HÌNH ẢNH ===
  addImage: async (req, res) => {
    try {
      const { HinhAnh, MaLP, Loai } = req.body;
      const newImage = new ImageModel({
        HinhAnh,
        MaLP,
        Loai,
      });
      const validation = imageCon.validateImage(newImage);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      const savedImage = await newImage.save();
      if (!savedImage) {
        return res.status(500).json({ message: "Lỗi khi lưu hình ảnh" });
      }

      await savedImage.populate({ path: "MaLP" });

      // Trả về hình ảnh đã lưu
      res.status(201).json({
        message: "Thêm hình ảnh thành công",
        data: savedImage,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === CẬP NHẬT HÌNH ẢNH ===
  updateImage: async (req, res) => {
    try {
      const imageToUpdate = await ImageModel.findById(req.params.id);
      if (!imageToUpdate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy hình ảnh loại phòng" });
      }
      // Kiểm tra điều kiện cập nhật
      const validation = imageCon.validateImage(imageToUpdate, req.params.id);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }
      await imageToUpdate.updateOne({ $set: req.body });
      res.status(200).json({
        message: "Cập nhật hình ảnh thành công",
        data: imageToUpdate,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === XÓA HÌNH ẢNH ===
  deleteImage: async (req, res) => {
    try {
      const imageToDelete = await ImageModel.findById(req.params.id);
      if (!imageToDelete) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy hình ảnh loại phòng" });
      }

      // Kiểm tra xem hình ảnh có đang được sử dụng hay không
      // const isImageUsed = await ImageModel.exists({ MaLP: imageToDelete.MaLP });
      // if (isImageUsed) {
      //   return res
      //     .status(400)
      //     .json({ message: "Hình ảnh này đang được sử dụng và không thể xóa" });
      // }

      await imageToDelete.deleteOne();
      res.status(200).json({
        message: "Xóa hình ảnh thành công",
        data: imageToDelete,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = imageCon;
