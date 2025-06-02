const router = require("express").Router();
const amenityCon = require("../controllers/amenityCon");
const middlewareCon = require("../controllers/middlewareCon");

// === LẤY TẤT CẢ TIỆN NGHI ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  amenityCon.getAllAmenities
);

// === LẤY TẤT CẢ TIỆN NGHI CHO USER ===
router.get("/user", amenityCon.getAllAmenitiesForUser);

// === LẤY TIỆN NGHI THEO ID ===
router.get("/:id", amenityCon.getAmenityById);

// === THÊM TIỆN NGHI ===
router.post("/", middlewareCon.authorizeRoles("admin"), amenityCon.addAmenity);

// === CẬP NHẬT TIỆN NGHI ===
router.put(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  amenityCon.updateAmenity
);

// === XÓA TIỆN NGHI ===
router.delete(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  amenityCon.deleteAmenity
);

module.exports = router;
