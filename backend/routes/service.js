const router = require("express").Router();
const serviceCon = require("../controllers/serviceCon");

// Thêm dịch vụ
router.post("/", serviceCon.addService);

// Lấy tất cả dịch vụ
router.get("/", serviceCon.getAllService);

// Lấy dịch vụ theo ID
router.get("/:id", serviceCon.getAnService);

// Cập nhật dịch vụ
router.put("/:id", serviceCon.updateService);

// Xóa dịch vụ
router.delete("/:id", serviceCon.deleteService);

module.exports = router;
