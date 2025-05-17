const service = require("../model/serviceModel");

const serviceCon = {
  // thêm dịch vụ
  addService: async (req, res) => {
    try {
      const newService = new service(req.body);
      const saveService = await newService.save();
      res.status(200).json(saveService);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // lấy tất cả dịch vụ
  getAllService: async (req, res) => {
    try {
      const services = await service.find()
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // lấy dịch vụ theo ID
  getAnService: async (req, res) => {
    try {
      const serviceData = await service.findById(req.params.id);
      res.status(200).json(serviceData);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // cập nhật dịch vụ
  updateService: async (req, res) => {
    try {
      const serviceToUpdate = await service.findById(req.params.id);
      await serviceToUpdate.updateOne({ $set: req.body });
      res.status(200).json("Cập nhật thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // xóa dịch vụ
  deleteService: async (req, res) => {
    try {
      await service.findByIdAndDelete(req.params.id);
      res.status(200).json("Xóa thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = serviceCon;
