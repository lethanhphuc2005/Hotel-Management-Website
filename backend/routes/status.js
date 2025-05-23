const router = require("express").Router();
const statusCon = require("../controllers/statusCon");

// Thêm trạng thái
router.post("/", statusCon.addStatus);

// Lấy tất cả trạng thái
router.get("/", statusCon.getAllStatus);

// Lấy trạng thái theo ID
router.get("/:id", statusCon.getAnStatus);

// Cập nhật trạng thái
router.put("/:id", statusCon.updateStatus);

// Xóa trạng thái
router.delete("/:id", statusCon.deleteStatus);

module.exports = router;
