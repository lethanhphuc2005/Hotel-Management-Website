const router = require("express").Router();

const contentTypeController = require("../controllers/contentType.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// === LẤY TẤT CẢ LOẠI NỘI DUNG ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin"),
  contentTypeController.getAllContentTypes
);

// === LẤY TẤT CẢ LOẠI NỘI DUNG CHO USER ===
router.get("/user", contentTypeController.getAllContentTypesForUser);

// === LẤY LOẠI NỘI DUNG THEO ID ===
router.get("/:id", contentTypeController.getContentTypeById);

// === THÊM LOẠI NỘI DUNG ===
router.post(
  "/",
  authMiddleware.authorizeRoles("admin"),
  contentTypeController.addContentType
);

// === CẬP NHẬT LOẠI NỘI DUNG ===
router.patch(
  "/:id",
  authMiddleware.authorizeRoles("admin"),
  contentTypeController.updateContentType
);

// === KÍCH HOẠT/ VÔ HIỆU HOÁ LOẠI NỘI DUNG ===
router.patch(
  "/toggle/:id",
  authMiddleware.authorizeRoles("admin"),
  contentTypeController.toggleContentTypeStatus
);

// === XÓA LOẠI NỘI DUNG ===
router.delete(
  "/:id",
  authMiddleware.authorizeRoles("admin"),
  contentTypeController.deleteContentType
);

module.exports = router;
