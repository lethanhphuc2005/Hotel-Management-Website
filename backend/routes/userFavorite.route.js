const router = require("express").Router();
const userFavoriteController = require("../controllers/userFavorite.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// === THÊM MỚI YÊU THÍCH ===
router.post(
  "/",
  authMiddleware.authorizeSelfOnly(),
  userFavoriteController.addFavorite
);

// === LẤY DANH SÁCH YÊU THÍCH CỦA NGƯỜI DÙNG ===
router.get(
  "/:id",
  authMiddleware.authorizeSelfOrRoles("admin", "receptionist"),
  userFavoriteController.getFavoritesByUserId
);

// === XÓA YÊU THÍCH ===
router.delete(
  "/:id",
  authMiddleware.authorizeSelfOnly(),
  userFavoriteController.deleteFavorite
);

module.exports = router;
