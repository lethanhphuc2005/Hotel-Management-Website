const router = require("express").Router();

const websiteContentCon = require("../controllers/websiteContentCon");
const middlewareCon = require("../controllers/middlewareCon");

// Thêm nội dung website
router.post(
  "/",
  middlewareCon.authorizeRoles("admin"),
  websiteContentCon.addWebsiteContent
);

// Lấy tất cả nội dung website
router.get("/", websiteContentCon.getAllWebsiteContents);

// Lấy nội dung website theo ID
router.get("/:id", websiteContentCon.getOneWebsiteContent);

// Cập nhật nội dung website
router.put(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  websiteContentCon.updateWebsiteContent
);

// Xóa nội dung website
router.delete(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  websiteContentCon.deleteWebsiteContent
);

module.exports = router;
