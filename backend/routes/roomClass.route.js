const router = require("express").Router();
const roomTypeController = require("../controllers/roomClass.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// === LẤY TẤT CẢ LOẠI PHÒNG ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  roomTypeController.getAllRoomClasses
);

// === LẤY TẤT CẢ LOẠI PHÒNG CHO USER ===
router.get("/user", roomTypeController.getAllRoomClassesForUser);

// === LẤY LOẠI PHÒNG THEO ID ===
router.get("/:id", roomTypeController.getRoomClassById);

// === THÊM LOẠI PHÒNG ===
router.post("/", authMiddleware.authorizeRoles("admin"), roomTypeController.addRoomClass);

// === CẬP NHẬT LOẠI PHÒNG ===
router.put(
  "/:id",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  roomTypeController.updateRoomClass
);

// === KÍCH HOẠT/ VÔ HIỆU HOÁ LOẠI PHÒNG ===
router.put(
  "/toggle/:id",
  authMiddleware.authorizeRoles("admin"),
  roomTypeController.toggleRoomClassStatus
);

// === XÓA LOẠI PHÒNG ===
router.delete(
  "/:id",
  authMiddleware.authorizeRoles("admin"),
  roomTypeController.deleteRoomClass
);

module.exports = router;
