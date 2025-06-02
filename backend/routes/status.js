const router = require("express").Router();

const statusCon = require("../controllers/statusCon");
const middlewareCon = require("../controllers/middlewareCon");

// === LẤY TẤT CẢ TRẠNG THÁI ===
router.get("/", statusCon.getAllStatus);

// === LẤY TRẠNG THÁI THEO ID ===
router.get("/:id", statusCon.getStatusById);

// === THÊM TRẠNG THÁI MỚI ===
router.post("/", middlewareCon.authorizeRoles("admin"), statusCon.addStatus);

// === CẬP NHẬT TRẠNG THÁI ===
router.put("/:id", middlewareCon.authorizeRoles("admin"), statusCon.updateStatus);

// === XÓA TRẠNG THÁI ===
router.delete("/:id", middlewareCon.authorizeRoles("admin"), statusCon.deleteStatus);

module.exports = router;
