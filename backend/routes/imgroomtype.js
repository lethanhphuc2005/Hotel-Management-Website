const router = require("express").Router();
const imgroomtypeCon = require("../controllers/imgroomtypeCon");

// Thêm hình ảnh loại phòng
router.post("/", imgroomtypeCon.addImgroomtype);

// Lấy tất cả hình ảnh loại phòng
router.get("/", imgroomtypeCon.getAllImgroomtype);

// Lấy hình ảnh loại phòng theo ID
router.get("/:id", imgroomtypeCon.getAnImgroomtype);

// Cập nhật hình ảnh loại phòng
router.put("/:id", imgroomtypeCon.updateImgroomtype);

// Xóa hình ảnh loại phòng
router.delete("/:id", imgroomtypeCon.deleteImgroomtype);

module.exports = router;
