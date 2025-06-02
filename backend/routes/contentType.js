const router = require("express").Router();

const contentTypeCon = require("../controllers/contentTypeCon");
const middlewareCon = require("../controllers/middlewareCon");

// === LẤY TẤT CẢ LOẠI NỘI DUNG ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin"),
  contentTypeCon.getAllContentTypes
);

// === LẤY TẤT CẢ LOẠI NỘI DUNG CHO USER ===
router.get("/user", contentTypeCon.getAllContentTypesForUser);

// === LẤY LOẠI NỘI DUNG THEO ID ===
router.get("/:id", contentTypeCon.getContentTypeByid);

// === THÊM LOẠI NỘI DUNG ===
router.post(
  "/",
  middlewareCon.authorizeRoles("admin"),
  contentTypeCon.addContentType
);

// === CẬP NHẬT LOẠI NỘI DUNG ===
router.put(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  contentTypeCon.updateContentType
);

// === XÓA LOẠI NỘI DUNG ===
router.delete(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  contentTypeCon.deleteContentType
);

module.exports = router;
