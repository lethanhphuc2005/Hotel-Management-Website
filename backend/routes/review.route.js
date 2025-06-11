const router = require("express").Router();
const reviewController = require("../controllers/review.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// === LẤY DANH SÁCH ĐÁNH GIÁ ===
router.get("/", authMiddleware.authorizeRoles("admin"), reviewController.getAllReviews);

// === LẤY DANH SÁCH ĐÁNH GIÁ CHO USER ===
router.get("/user", reviewController.getAllReviewsForUser);

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
router.put(
  "/:id",
  authMiddleware.authorizeCommentAndReview(),
  reviewController.updateReview
);

// === KÍCH HOẠT/ VÔ HIỆU HÓA ĐÁNH GIÁ ===
router.put(
  "/toggle/:id",
  authMiddleware.authorizeRoles("admin"),
  reviewController.toggleReviewStatus
);

// // === XÓA ĐÁNH GIÁ ===
// router.delete(
//   "/:id",
//   authMiddleware.authorizeCommentAndReview(),
//   reviewController.deleteReview
// );

module.exports = router;
