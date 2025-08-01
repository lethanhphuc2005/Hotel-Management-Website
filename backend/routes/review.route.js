const router = require("express").Router();
const reviewController = require("../controllers/review.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// === LẤY DANH SÁCH ĐÁNH GIÁ ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin"),
  reviewController.getAllReviews
);

// === LẤY DANH SÁCH ĐÁNH GIÁ CHO USER ===
router.get("/user/:userId", reviewController.getAllReviewsForUser);

// === LẤY DANH SÁCH ĐÁNH GIÁ THEO PHÒNG ===
router.get("/room/:roomId", reviewController.getReviewsByRoomClassId);

// === LẤY DANH SÁCH ĐÁNH GIÁ THEO ID ===
router.get(
  "/:id",
  authMiddleware.authorizeSelfOrRoles("admin"),
  reviewController.getReviewById
);

// === THÊM ĐÁNH GIÁ ===
router.post(
  "/",
  authMiddleware.authorizeSelfOrRoles("admin"),
  reviewController.addReview
);

// === CẬP NHẬT ĐÁNH GIÁ ===
router.patch(
  "/:id",
  authMiddleware.authorizeSelfOrRoles("admin"),
  reviewController.updateReview
);

// === KÍCH HOẠT/ VÔ HIỆU HÓA ĐÁNH GIÁ ===
router.patch(
  "/toggle/:id",
  authMiddleware.authorizeSelfOrRoles("admin"),
  reviewController.toggleReviewStatus
);

// // === XÓA ĐÁNH GIÁ ===
// router.delete(
//   "/:id",
//   authMiddleware.authorizeCommentAndReview(),
//   reviewController.deleteReview
// );

module.exports = router;
