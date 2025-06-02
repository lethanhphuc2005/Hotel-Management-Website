const router = require("express").Router();
const roomTypeCon = require("../controllers/roomTypeCon");
const middleware = require("../controllers/middlewareCon");

// === LẤY TẤT CẢ LOẠI PHÒNG ===
router.get(
  "/",
  middleware.authorizeRoles("admin", "receptionist"),
  roomTypeCon.getAllRoomTypes
);

// === LẤY TẤT CẢ LOẠI PHÒNG CHO USER ===
router.get("/user", roomTypeCon.getAllRoomTypesForUser);

// === LẤY LOẠI PHÒNG THEO ID ===
router.get("/:id", roomTypeCon.getRoomTypeById);

// === THÊM LOẠI PHÒNG ===
router.post("/", middleware.authorizeRoles("admin"), roomTypeCon.addRoomType);

// === CẬP NHẬT LOẠI PHÒNG ===
router.put(
  "/:id",
  middleware.authorizeRoles("admin", "receptionist"),
  roomTypeCon.updateRoomType
);

// === XÓA LOẠI PHÒNG ===
router.delete(
  "/:id",
  middleware.authorizeRoles("admin"),
  roomTypeCon.deleteRoomType
);

module.exports = router;
