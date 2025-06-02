const router = require("express").Router();

const roomTypeMainCon = require("../controllers/roomTypeMainCon");
const middlewareCon = require("../controllers/middlewareCon");

// Thêm loại phòng
router.post(
  "/",
  middlewareCon.authorizeRoles("admin"),
  roomTypeMainCon.addRoomTypeMain
);

// Lấy tất cả loại phòng
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  roomTypeMainCon.getAllRoomTypeMains
);

// Lấy loại phòng cho user
router.get("/user", roomTypeMainCon.getRoomTypeMainsForUser);

// Lấy loại phòng theo ID
router.get("/:id", roomTypeMainCon.getRoomTypeMainById);

// Cập nhật loại phòng
router.put(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  roomTypeMainCon.updateRoomTypeMain
);

// Xóa loại phòng
router.delete(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  roomTypeMainCon.deleteRoomTypeMain
);

module.exports = router;
