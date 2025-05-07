const router = require("express").Router();
const roomCon = require("../controllers/roomCon");

// Thêm phòng mới
router.post("/", roomCon.addRoom);

// Lấy tất cả phòng
router.get("/", roomCon.getAllRoom);

// Lấy phòng theo ID
router.get("/:id", roomCon.getRoomById);

// Cập nhật phòng
router.put("/:id", roomCon.updateRoom);

// Xóa phòng
router.delete("/:id", roomCon.deleteRoom);

module.exports = router;
