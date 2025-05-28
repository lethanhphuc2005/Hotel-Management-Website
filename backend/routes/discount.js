const router = require("express").Router();
const discountCon = require("../controllers/discountCon");
const middlewareCon = require("../controllers/middlewareCon");

// Lấy tất cả khuyến mãi
router.get("/", discountCon.getAllDiscounts);

// Lấy khuyến mãi theo ID
router.get("/:id", discountCon.getOneDiscount);

// Thêm khuyến mãi
router.post("/", middlewareCon.authorizeRoles("admin"), discountCon.addDiscount);

// Cập nhật khuyến mãi
router.put("/:id", middlewareCon.authorizeRoles("admin"), discountCon.updateDiscount);

// Xóa khuyến mãi
router.delete("/:id", middlewareCon.authorizeRoles("admin"), discountCon.deleteDiscount);

module.exports = router;
