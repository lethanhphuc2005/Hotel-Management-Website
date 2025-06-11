const router = require("express").Router();

const mainRoomClassController = require("../controllers/mainRoomClass.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// === LẤY TẤT CẢ LOẠI PHÒNG CHÍNH ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  mainRoomClassController.getAllMainRoomClasses
);

// === LẤY TẤT CẢ LOẠI PHÒNG CHÍNH CHO USER ===
router.get("/user", mainRoomClassController.getAllMainRoomClassesForUser);

// === LẤY LOẠI PHÒNG CHÍNH THEO ID ===
router.get("/:id", mainRoomClassController.getMainRoomClassById);

// === THÊM LOẠI PHÒNG CHÍNH ===
router.post(
  "/",
  authMiddleware.authorizeRoles("admin"),
  mainRoomClassController.addMainRoomClass
);

// === CẬP NHẬT LOẠI PHÒNG CHÍNH ===
router.put(
  "/:id",
  authMiddleware.authorizeRoles("admin"),
  mainRoomClassController.updateMainRoomClass
);

// === KÍCH HOẠT/ VÔ HIỆU HOÁ LOẠI PHÒNG CHÍNH ===
router.put(
  "/toggle/:id",
  authMiddleware.authorizeRoles("admin"),
  mainRoomClassController.toggleMainRoomClassStatus
);

// // === XÓA LOẠI PHÒNG CHÍNH ===
// router.delete(
//   "/:id",
//   authMiddleware.authorizeRoles("admin"),
//   mainRoomClassController.deleteMainRoomClass
// );

module.exports = router;
