const router = require("express").Router();
const websitecontentCon = require("../controllers/websitecontentCon");

// Thêm nội dung website
router.post("/", websitecontentCon.addWebsitecontent);

// Lấy tất cả nội dung website
router.get("/", websitecontentCon.getAllWebsitecontent);

// Lấy nội dung website theo ID
router.get("/:id", websitecontentCon.getAnWebsitecontent);

// Cập nhật nội dung website
router.put("/:id", websitecontentCon.updateWebsitecontent);

// Xóa nội dung website
router.delete("/:id", websitecontentCon.deleteWebsitecontent);

module.exports = router;
