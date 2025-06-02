const router = require("express").Router();

const roomTypeMainCon = require("../controllers/roomTypeMainCon");
const middlewareCon = require("../controllers/middlewareCon");

// === LẤY TẤT CẢ LOẠI PHÒNG CHÍNH ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  roomTypeMainCon.getAllRoomTypeMains
);

// === LẤY TẤT CẢ LOẠI PHÒNG CHÍNH CHO USER ===
router.get("/user", roomTypeMainCon.getRoomTypeMainsForUser);

// === LẤY LOẠI PHÒNG CHÍNH THEO ID ===
router.get("/:id", roomTypeMainCon.getRoomTypeMainById);

// === THÊM LOẠI PHÒNG CHÍNH ===
router.post(
  "/",
  middlewareCon.authorizeRoles("admin"),
  roomTypeMainCon.addRoomTypeMain
);

// === CẬP NHẬT LOẠI PHÒNG CHÍNH ===
router.put(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  roomTypeMainCon.updateRoomTypeMain
);

// === XÓA LOẠI PHÒNG CHÍNH ===
router.delete(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  roomTypeMainCon.deleteRoomTypeMain
);

module.exports = router;
