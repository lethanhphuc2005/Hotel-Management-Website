const router = require("express").Router();
const phongCon = require("../controllers/phongCon");

// Thêm phòng mới
router.post("/", phongCon.addPhong);

// Lấy tất cả phòng
router.get("/", phongCon.getAllPhong);

// Lấy phòng theo ID
router.get("/:id", phongCon.getPhongById);

// Cập nhật phòng
router.put("/:id", phongCon.updatePhong);

// Xóa phòng
router.delete("/:id", phongCon.deletePhong);

module.exports = router;
