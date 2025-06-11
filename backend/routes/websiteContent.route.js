const router = require("express").Router();

const websiteContentCon = require("../controllers/websiteContent.controller");
const middlewareCon = require("../middlewares/auth.middleware");

// === LẤY TẤT CẢ NỘI DUNG WEBSITE ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin"),
  websiteContentCon.getAllWebsiteContents
);

// === LẤY TẤT CẢ NỘI DUNG WEBSITE CHO USER ===
router.get("/user", websiteContentCon.getAllWebsiteContentsForUser);

// === LẤY NỘI DUNG WEBSITE THEO ID ===
router.get("/:id", websiteContentCon.getWebsiteContentById);

// === THÊM NỘI DUNG WEBSITE ===
router.post(
  "/",
  middlewareCon.authorizeRoles("admin"),
  websiteContentCon.addWebsiteContent
);

// === CẬP NHẬT NỘI DUNG WEBSITE ===
router.put(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  websiteContentCon.updateWebsiteContent
);

// === KÍCH HOẠT/ VÔ HIỆU HOÁ NỘI DUNG WEBSITE ===
router.put(
  "/toggle/:id",
  middlewareCon.authorizeRoles("admin"),
  websiteContentCon.toggleWebsiteContentStatus
);

// === XÓA NỘI DUNG WEBSITE ===
router.delete(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  websiteContentCon.deleteWebsiteContent
);

module.exports = router;
