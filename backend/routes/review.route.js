const router = require("express").Router();
const reviewCon = require("../controllers/review.controller");
const middlewareCon = require("../middlewares/auth.middleware");

// === LẤY DANH SÁCH ĐÁNH GIÁ ===
router.get("/", middlewareCon.authorizeRoles("admin"), reviewCon.getAllReviews);

// === LẤY DANH SÁCH ĐÁNH GIÁ CHO USER ===
router.get("/user", reviewCon.getAllReviewsForUser);

// === LẤY DANH SÁCH ĐÁNH GIÁ THEO ID ===
router.get(
  "/:id",
  middlewareCon.authorizeSelfOrRoles("admin"),
  reviewCon.getReviewById
);

// === THÊM ĐÁNH GIÁ ===
router.post(
  "/",
  middlewareCon.authorizeSelfOrRoles("admin"),
  reviewCon.addReview
);

// === CẬP NHẬT ĐÁNH GIÁ ===
router.put(
  "/:id",
  middlewareCon.authorizeCommentAndReview(),
  reviewCon.updateReview
);

// === KÍCH HOẠT/ VÔ HIỆU HÓA ĐÁNH GIÁ ===
router.put(
  "/toggle/:id",
  middlewareCon.authorizeRoles("admin"),
  reviewCon.toggleReviewStatus
);

// // === XÓA ĐÁNH GIÁ ===
// router.delete(
//   "/:id",
//   middlewareCon.authorizeCommentAndReview(),
//   reviewCon.deleteReview
// );

module.exports = router;
