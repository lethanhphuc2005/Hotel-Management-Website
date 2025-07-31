const router = require("express").Router();
const commentController = require("../controllers/comment.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// === LẤY DANH SÁCH BÌNH LUẬN ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin"),
  commentController.getAllComments
);

// === LẤY DANH SÁCH BÌNH LUẬN CHO USER ===
router.get("/user/:userId", commentController.getAllCommentsForUser);

// === LẤY DANH SÁCH BÌNH LUẬN THEO ID PHÒNG ===
router.get("/room/:roomId", commentController.getCommentsByRoomClassId);

// === LẤY DANH SÁCH BÌNH LUẬN THEO ID ===
router.get("/:id", commentController.getCommentById);

// === THÊM BÌNH LUẬN ===
router.post("/", commentController.addComment);

// === CẬP NHẬT BÌNH LUẬN ===
router.patch(
  "/:id",
  authMiddleware.authorizeSelfOrRoles("admin"),
  commentController.updateComment
);

// // === XÓA BÌNH LUẬN ===
// router.delete(
//   "/:id",
//   authMiddleware.authorizeCommentAndReview(),
//   commentController.deleteComment
// );

// === KÍCH HOẠT/ VÔ HIỆU HÓA BÌNH LUẬN ===
router.patch(
  "/toggle/:id",
  authMiddleware.authorizeSelfOrRoles("admin"),
  commentController.toggleCommentStatus
);

module.exports = router;
