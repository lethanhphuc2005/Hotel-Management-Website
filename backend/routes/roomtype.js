const router = require("express").Router();
const roomTypeCon = require("../controllers/roomTypeCon");
const middleware = require("../controllers/middlewareCon");

// Lấy tất cả loại phòng
router.get(
  "/",
  middleware.authorizeRoles("admin", "receptionist"),
  roomTypeCon.getAllRoomTypes
);
// Lấy tất cả loại phòng cho user
router.get("/user", roomTypeCon.getAllRoomTypesForUser);
// Lấy loại phòng theo ID
router.get("/:id", roomTypeCon.getRoomTypeById);
// Thêm loại phòng mới
router.post("/", middleware.authorizeRoles("admin"), roomTypeCon.addRoomType);
// Cập nhật loại phòng theo ID
router.put(
  "/:id",
  middleware.authorizeRoles("admin", "receptionist"),
  roomTypeCon.updateRoomType
);
// Xóa loại phòng theo ID
router.delete(
  "/:id",
  middleware.authorizeRoles("admin"),
  roomTypeCon.deleteRoomType
);

module.exports = router;
