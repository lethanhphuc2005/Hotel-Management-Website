const router = require("express").Router();
const amenityCon = require("../controllers/amenityCon");
const middlewareCon = require("../controllers/middlewareCon");

// Get all amenities
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  amenityCon.getAllAmenities
);
// Get all amenities for user
router.get("/user", amenityCon.getAllAmenitiesForUser);
// Get amenity by ID
router.get("/:id", amenityCon.getAmenityById);
// Create a new amenity
router.post("/", middlewareCon.authorizeRoles("admin"), amenityCon.addAmenity);
// Update an amenity by ID
router.put(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  amenityCon.updateAmenity
);
// Delete an amenity by ID
router.delete(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  amenityCon.deleteAmenity
);

module.exports = router;
