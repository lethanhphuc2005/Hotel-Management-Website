const router = require("express").Router();
const roomTypeCon = require("../controllers/roomClass.controller");
const middlewareCon = require("../middlewares/auth.middleware");

// === LẤY TẤT CẢ LOẠI PHÒNG ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  roomTypeCon.getAllRoomClasses
);

// === LẤY TẤT CẢ LOẠI PHÒNG CHO USER ===
router.get("/user", roomTypeCon.getAllRoomClassesForUser);

// === LẤY LOẠI PHÒNG THEO ID ===
router.get("/:id", roomTypeCon.getRoomClassById);

// === THÊM LOẠI PHÒNG ===
router.post("/", middlewareCon.authorizeRoles("admin"), roomTypeCon.addRoomClass);

// === CẬP NHẬT LOẠI PHÒNG ===
router.put(
  "/:id",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  roomTypeCon.updateRoomClass
);

// === KÍCH HOẠT/ VÔ HIỆU HOÁ LOẠI PHÒNG ===
router.put(
  "/toggle/:id",
  middlewareCon.authorizeRoles("admin"),
  roomTypeCon.toggleRoomClassStatus
);

// === XÓA LOẠI PHÒNG ===
router.delete(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  roomTypeCon.deleteRoomClass
);

module.exports = router;
