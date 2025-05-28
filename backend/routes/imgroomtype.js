const router = require("express").Router();

const imgRoomTypeCon = require("../controllers/imgroomtypeCon");

// Thêm hình ảnh loại phòng
router.post("/", imgRoomTypeCon.addImgRoomType);

// Lấy tất cả hình ảnh loại phòng
router.get("/", imgRoomTypeCon.getAllimgRoomType);

// Lấy hình ảnh loại phòng theo ID
router.get("/:id", imgRoomTypeCon.getAnimgRoomType);

// Cập nhật hình ảnh loại phòng
router.put("/:id", imgRoomTypeCon.updateimgRoomType);

// Xóa hình ảnh loại phòng
router.delete("/:id", imgRoomTypeCon.deleteimgRoomType);

module.exports = router;
