const router = require("express").Router();

const contentTypeCon = require("../controllers/contentType.controller");
const middlewareCon = require("../middlewares/middleware.controller");

// === LẤY TẤT CẢ LOẠI NỘI DUNG ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin"),
  contentTypeCon.getAllContentTypes
);

// === LẤY TẤT CẢ LOẠI NỘI DUNG CHO USER ===
router.get("/user", contentTypeCon.getAllContentTypesForUser);

// === LẤY LOẠI NỘI DUNG THEO ID ===
router.get("/:id", contentTypeCon.getContentTypeById);

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

// === KÍCH HOẠT/ VÔ HIỆU HOÁ LOẠI NỘI DUNG ===
router.put(
  "/toggle/:id",
  middlewareCon.authorizeRoles("admin"),
  contentTypeCon.toggleContentTypeStatus
);

// === XÓA LOẠI NỘI DUNG ===
router.delete(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  contentTypeCon.deleteContentType
);

module.exports = router;
