const router = require("express").Router();

const websiteContentController = require("../controllers/websiteContent.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// === LẤY TẤT CẢ NỘI DUNG WEBSITE ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin"),
  websiteContentController.getAllWebsiteContents
);

// === LẤY TẤT CẢ NỘI DUNG WEBSITE CHO USER ===
router.get("/user", websiteContentController.getAllWebsiteContentsForUser);

// === LẤY NỘI DUNG WEBSITE THEO ID ===
router.get("/:id", websiteContentController.getWebsiteContentById);

// === THÊM NỘI DUNG WEBSITE ===
router.post(
  "/",
  authMiddleware.authorizeRoles("admin"),
  websiteContentController.addWebsiteContent
);

// === CẬP NHẬT NỘI DUNG WEBSITE ===
router.put(
  "/:id",
  authMiddleware.authorizeRoles("admin"),
  websiteContentController.updateWebsiteContent
);

// === KÍCH HOẠT/ VÔ HIỆU HOÁ NỘI DUNG WEBSITE ===
router.put(
  "/toggle/:id",
  authMiddleware.authorizeRoles("admin"),
  websiteContentController.toggleWebsiteContentStatus
);

// === XÓA NỘI DUNG WEBSITE ===
router.delete(
  "/:id",
  authMiddleware.authorizeRoles("admin"),
  websiteContentController.deleteWebsiteContent
);

module.exports = router;
