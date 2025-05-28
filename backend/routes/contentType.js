const router = require("express").Router();

const contentTypeCon = require("../controllers/contentTypeCon");
const middlewareCon = require("../controllers/middlewareCon");

// Thêm loại nội dung
router.post(
  "/",
  middlewareCon.authorizeRoles("admin"),
  contentTypeCon.addContentType
);
// Lấy tất cả loại nội dung
router.get("/", contentTypeCon.getAllContentTypes);
// Lấy loại nội dung theo ID
router.get("/:id", contentTypeCon.getOneContentType);
// Cập nhật loại nội dung
router.put(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  contentTypeCon.updateContentType
);
// Xoá loại nội dung
router.delete(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  contentTypeCon.deleteContentType
);

module.exports = router;
