const router = require("express").Router();

const roomStatusCon = require("../controllers/roomStatusCon");
const middlewareCon = require("../controllers/middlewareCon");

// === LẤY TẤT CẢ TRẠNG THÁI PHÒNG ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  roomStatusCon.getAllRoomStatus
);

// === LẤY TRẠNG THÁI PHÒNG THEO ID ===
router.get(
  "/:id",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  roomStatusCon.getRoomStatusById
);

// === THÊM TRẠNG THÁI PHÒNG MỚI ===
router.post(
  "/",
  middlewareCon.authorizeRoles("admin"),
  roomStatusCon.addRoomStatus
);

// === CẬP NHẬT TRẠNG THÁI PHÒNG ===
router.put(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  roomStatusCon.updateRoomStatus
);

// === XÓA TRẠNG THÁI PHÒNG ===
router.delete(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  roomStatusCon.deleteRoomStatus
);

module.exports = router;
