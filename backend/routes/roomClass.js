const router = require("express").Router();
const roomTypeCon = require("../controllers/roomClassCon");
const middleware = require("../middlewares/middlewareCon");

// === LẤY TẤT CẢ LOẠI PHÒNG ===
router.get(
  "/",
  middleware.authorizeRoles("admin", "receptionist"),
  roomTypeCon.getAllRoomClasses
);

// === LẤY TẤT CẢ LOẠI PHÒNG CHO USER ===
router.get("/user", roomTypeCon.getAllRoomClassesForUser);

// === LẤY LOẠI PHÒNG THEO ID ===
router.get("/:id", roomTypeCon.getRoomClassById);

// === THÊM LOẠI PHÒNG ===
router.post("/", middleware.authorizeRoles("admin"), roomTypeCon.addRoomClass);

// === CẬP NHẬT LOẠI PHÒNG ===
router.put(
  "/:id",
  middleware.authorizeRoles("admin", "receptionist"),
  roomTypeCon.updateRoomClass
);

// === KÍCH HOẠT/ VÔ HIỆU HOÁ LOẠI PHÒNG ===
router.put(
  "/toggle/:id",
  middleware.authorizeRoles("admin"),
  roomTypeCon.toggleRoomClassStatus
);

// === XÓA LOẠI PHÒNG ===
router.delete(
  "/:id",
  middleware.authorizeRoles("admin"),
  roomTypeCon.deleteRoomClass
);

module.exports = router;
