const router = require("express").Router();

const statusCon = require("../controllers/statusCon");
const middlewareCon = require("../controllers/middlewareCon");

// Thêm trạng thái
router.post("/", middlewareCon.authorizeRoles("admin"), statusCon.addStatus);

// Lấy tất cả trạng thái
router.get("/", statusCon.getAllStatus);

// Lấy trạng thái theo ID
router.get("/:id", statusCon.getOneStatus);

// Cập nhật trạng thái
router.put("/:id", middlewareCon.authorizeRoles("admin"), statusCon.updateStatus);

// Xóa trạng thái
router.delete("/:id", middlewareCon.authorizeRoles("admin"), statusCon.deleteStatus);

module.exports = router;
