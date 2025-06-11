const router = require("express").Router();

const mainRoomClassCon = require("../controllers/mainRoomClass.controller");
const middlewareCon = require("../middlewares/auth.middleware");

// === LẤY TẤT CẢ LOẠI PHÒNG CHÍNH ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  mainRoomClassCon.getAllMainRoomClasses
);

// === LẤY TẤT CẢ LOẠI PHÒNG CHÍNH CHO USER ===
router.get("/user", mainRoomClassCon.getAllMainRoomClassesForUser);

// === LẤY LOẠI PHÒNG CHÍNH THEO ID ===
router.get("/:id", mainRoomClassCon.getMainRoomClassById);

// === THÊM LOẠI PHÒNG CHÍNH ===
router.post(
  "/",
  middlewareCon.authorizeRoles("admin"),
  mainRoomClassCon.addMainRoomClass
);

// === CẬP NHẬT LOẠI PHÒNG CHÍNH ===
router.put(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  mainRoomClassCon.updateMainRoomClass
);

// === KÍCH HOẠT/ VÔ HIỆU HOÁ LOẠI PHÒNG CHÍNH ===
router.put(
  "/toggle/:id",
  middlewareCon.authorizeRoles("admin"),
  mainRoomClassCon.toggleMainRoomClassStatus
);

// // === XÓA LOẠI PHÒNG CHÍNH ===
// router.delete(
//   "/:id",
//   middlewareCon.authorizeRoles("admin"),
//   mainRoomClassCon.deleteMainRoomClass
// );

module.exports = router;
