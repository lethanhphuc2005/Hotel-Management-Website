const router = require("express").Router();
const websiteContentCon = require("../controllers/websiteContentCon");

// Thêm nội dung website
router.post("/", websiteContentCon.addWebsiteContent);

// Lấy tất cả nội dung website
router.get("/", websiteContentCon.getAllWebsiteContent);

// Lấy nội dung website theo ID
router.get("/:id", websiteContentCon.getAWebsiteContent);

// Cập nhật nội dung website
router.put("/:id", websiteContentCon.updateWebsiteContent);

// Xóa nội dung website
router.delete("/:id", websiteContentCon.deleteWebsiteContent);

module.exports = router;
