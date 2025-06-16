const BookingMethod = require("../models/bookingMethod.model");
const Booking = require("../models/booking.model");
const { BookingStatus } = require("../models/status.model");
const {
  BookingDetail,
  Booking_Detail_Service,
} = require("../models/bookingDetail.model");
const User = require("../models/user.model");
const Employee = require("../models/employee.model");
const Room = require("../models/room.model");
const RoomClass = require("../models/roomClass.model");
const Discount = require("../models/discount.model");
const PaymentMethod = require("../models/paymentMethod.model");
const Service = require("../models/service.model");

const bookingController = {
  // === KIỂM TRA ĐIỀU KIỆN PHƯƠNG THỨC ĐẶT PHÒNG ===
  validateBooking: async (bookingData, bookingId) => {
    const {
      check_in_date,
      check_out_date,
      adult_amount,
      child_amount,
      payment_method_id,
      booking_method_id,
      booking_status_id,
      details,
      discount_id,
      user_id,
      employee_id,
    } = bookingData;

    // Kiểm tra ngày nhận phòng
    if (!check_in_date || isNaN(new Date(check_in_date).getTime())) {
      return { valid: false, message: "Vui lòng chọn ngày nhận phòng hợp lệ." };
    }

    // Kiểm tra ngày trả phòng
    if (!check_out_date || isNaN(new Date(check_out_date).getTime())) {
      return { valid: false, message: "Vui lòng chọn ngày trả phòng hợp lệ." };
    }

    // Kiểm tra số lượng người lớn
    if (!adult_amount || adult_amount < 1) {
      return { valid: false, message: "Số lượng người lớn phải lớn hơn 0." };
    }

    // Kiểm tra số lượng trẻ em
    if (child_amount < 0) {
      return { valid: false, message: "Số lượng trẻ em không thể âm." };
    }

    // Kiểm tra người dùng
    const checkUser = await User.findById(user_id);
    if (!checkUser) {
      return { valid: false, message: "Người dùng không tồn tại." };
    }

    // Kiểm tra nhân viên
    if (employee_id) {
      const checkEmployee = await Employee.findById(employee_id);
      if (!checkEmployee) {
        return { valid: false, message: "Nhân viên không tồn tại." };
      }
    }

    // Ngày đặt phòng lấy từ ngày hiện tại
    const booking_date = new Date();

    // Kiểm tra ngày nhận phòng không được trước ngày đặt phòng
    if (new Date(check_in_date) < new Date(booking_date)) {
      return {
        valid: false,
        message: "Ngày nhận phòng không được trước ngày đặt phòng.",
      };
    }

    // Kiểm tra ngày trả phòng không được trước ngày nhận phòng
    if (new Date(check_out_date) <= new Date(check_in_date)) {
      return {
        valid: false,
        message: "Ngày trả phòng phải sau ngày nhận phòng.",
      };
    }

    // Kiểm tra phương thức đặt phòng
    if (!booking_method_id) {
      return { valid: false, message: "Vui lòng chọn phương thức đặt phòng." };
    }

    // Kiểm tra trạng thái đặt phòng
    if (!booking_status_id) {
      return { valid: false, message: "Vui lòng chọn trạng thái đặt phòng." };
    }

    // Kiểm tra chi tiết đặt phòng
    if (!details || details.length === 0) {
      return { valid: false, message: "Vui lòng thêm chi tiết đặt phòng." };
    }

    // Kiếm tra khuyến mãi (nếu có)
    if (discount_id) {
      const discount = await Discount.findById(discount_id);
      if (!discount) {
        return { valid: false, message: "Khuyến mãi không tồn tại." };
      }
    }

    // Kiểm tra phương thức đặt phòng có tồn tại không
    const method = await BookingMethod.findById(booking_method_id);
    if (!method) {
      return { valid: false, message: "Phương thức đặt phòng không tồn tại." };
    }

    // Kiểm tra trạng thái đặt phòng có tồn tại không
    const status = await BookingStatus.findById(booking_status_id);
    if (!status) {
      return { valid: false, message: "Trạng thái đặt phòng không tồn tại." };
    }

    // Kiểm tra phương thức thanh toán
    const paymentMethod = await PaymentMethod.findById(payment_method_id);
    if (!paymentMethod) {
      return { valid: false, message: "Phương thức thanh toán không tồn tại." };
    }

    // Kiểm tra chi tiết đặt phòng có hợp lệ không
    let totalCapacity = 0;

    if (Array.isArray(child_amount)) {
      totalChildren = child_amount.length;
    } else if (typeof child_amount === "number") {
      totalChildren = child_amount;
    }

    const totalPeople = (adult_amount || 0) + totalChildren;

    let calculatedTotalPrice = 0;

    for (const detail of details) {
      // Kiểm tra room_id
      if (!detail.room_id) {
        return {
          valid: false,
          message: "Chi tiết đặt phòng thiếu thông tin phòng.",
        };
      }
      if (!detail.price_per_night || detail.price_per_night < 0) {
        return {
          valid: false,
          message: "Giá phòng trong chi tiết đặt phòng không hợp lệ.",
        };
      }
      if (!detail.nights || detail.nights < 1) {
        return {
          valid: false,
          message: "Số đêm trong chi tiết đặt phòng không hợp lệ.",
        };
      }
      const room = await Room.findById(detail.room_id);
      if (!room) {
        return {
          valid: false,
          message: `Phòng với ID ${detail.room_id} không tồn tại.`,
        };
      }
      const roomClass = await RoomClass.findById(room.room_class_id);
      if (!roomClass) {
        return {
          valid: false,
          message: `Loại phòng của phòng ${room.room_name} không tồn tại.`,
        };
      }
      totalCapacity += roomClass.room_class_capacity;

      // Tính tổng tiền phòng
      calculatedTotalPrice += detail.price_per_night * detail.nights;

      // Kiểm tra dịch vụ nếu có
      if (detail.services && detail.services.length > 0) {
        for (const service of detail.services) {
          if (!service.service_id) {
            return {
              valid: false,
              message: "Dịch vụ trong chi tiết đặt phòng không hợp lệ.",
            };
          }
          const serviceExists = await Service.findOne({
            _id: service.service_id,
          });
          if (!serviceExists) {
            return {
              valid: false,
              message: `Dịch vụ với ID ${service.service_id} không tồn tại.`,
            };
          }
        }
      }
    }

    // Gán lại tổng tiền vào bookingData (nếu cần)
    bookingData.total_price = calculatedTotalPrice;

    if (totalPeople > totalCapacity) {
      return {
        valid: false,
        message: `Tổng số người (${totalPeople}) vượt quá sức chứa cho phép (${totalCapacity}).`,
      };
    }

    // Kiểm tra xem user có đơn đặt nào đang chờ xử lý không

    const existingBooking = await Booking.findOne({
      user_id,
      booking_status_id: {
        $in: ["683fba8d351a96315d45767a", "683fba8d351a96315d45767b"],
      },
    });
    if (existingBooking) {
      return {
        valid: false,
        message: "Bạn đã có đơn đặt phòng đang chờ xử lý.",
      };
    }

    return { valid: true };
  },

  // === THÊM PHÒNG ĐẶT MỚI ===
  addBooking: async (req, res) => {
    try {
      const validation = await bookingController.validateBooking(
        req.body,
        req.body._id
      );

      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }
      const { details } = req.body;
      const newBooking = new Booking(req.body);

      // Tính phụ phí cho trẻ em nếu có
      let childrenFee = 0;
      if (req.body.child_amount && req.body.child_amount.length > 0) {
        for (const child of req.body.child_amount) {
          const age = child.age;

          // Giả sử chính sách:
          // <6 tuổi: miễn phí
          // 6-16 tuổi: phụ phí 100k
          if (age < 6)
            newBooking.note += "Trẻ em dưới 6 tuổi được miễn phí. \n";
          else if (age >= 6 && age <= 16) {
            childrenFee += 100000; // phụ phí 100k cho trẻ em từ 6-11 tuổi
            newBooking.note += `Trẻ em ${age} tuổi được tính phụ phí 100k.\n`;
          }
        }

        newBooking.child_amount = req.body.child_amount.length; // lưu lại thông tin trẻ em
        newBooking.extra_fee = (newBooking.extra_fee || 0) + childrenFee;
        newBooking.total_price = (newBooking.total_price || 0) + childrenFee; // cộng phụ phí vào tổng tiền
      }

      // Thêm booking details
      if (details && details.length > 0) {
        for (const detail of details) {
          const bookingDetail = new BookingDetail({
            booking_id: newBooking._id,
            room_id: detail.room_id,
            price_per_night: detail.price_per_night,
            nights: detail.nights,
          });
          await bookingDetail.save();

          // Thêm dịch vụ nếu có
          if (detail.services && detail.services.length > 0) {
            for (const service of detail.services) {
              const bookingDetailService = new Booking_Detail_Service({
                booking_detail_id: bookingDetail._id,
                service_id: service.service_id,
                amount: service.amount,
              });
              await bookingDetailService.save();
            }
          }
        }
      }

      await newBooking.save();
      res.status(201).json({
        message: "Thêm phòng đặt thành công",
        data: newBooking,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === LẤY DANH SÁCH PHÒNG ĐẶT ===
  getAllBookings: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort = "booking_status_id",
        order = "desc",
        user,
        status,
      } = req.query;

      // Tạo query tìm kiếm
      const query = {};

      if (status) {
        query.booking_status_id = status;
      }

      // Sắp xếp
      const sortOption = {};
      if (sort === "status") {
        sortOption.booking_status_id = order === "asc" ? 1 : -1;
      } else {
        sortOption[sort] = order === "asc" ? 1 : -1;
      }

      if (user) {
        query.user_id = user; // Lọc theo người dùng nếu có
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [bookings, total] = await Promise.all([
        Booking.find(query)
          .sort(sortOption)
          .skip(skip)
          .limit(parseInt(limit))
          .populate([
            { path: "booking_status", select: "name" },
            { path: "booking_method", select: "name" },
            { path: "user", select: "-createdAt -updatedAt -status" },
            {
              path: "employee",
              select: "first_name last_name position department",
            },
            {
              path: "payment",
              populate: { path: "payment_method", select: "name" },
            },
            { path: "discount", select: "name type value start_date end_date" },
            {
              path: "booking_details",
              populate: [
                {
                  path: "room",
                  select: "name floor",
                  populate: [
                    {
                      path: "room_class_id",
                      select:
                        "-main_room_class_id -createdAt -updatedAt -description -status",
                    },
                    { path: "room_status_id", select: "name" },
                  ],
                },
                {
                  path: "services",
                  select: "service_id amount -booking_detail_id",
                  populate: {
                    path: "service_id",
                    select: "name price",
                  },
                },
              ],
            },
          ])
          .exec(),
        Booking.countDocuments(query),
      ]);

      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: "Không có đơn đặt phòng nào." });
      }

      res.status(200).json({
        message: "Lấy danh sách đơn đặt phòng thành công",
        data: bookings,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === LẤY DANH SÁCH PHÒNG ĐẶT THEO USER ===
  getAllBookingsByUser: async (req, res) => {
    try {
      const userId = req.params.userId;

      const checkUser = await User.findById(userId);
      if (!checkUser) {
        return res.status(404).json({ message: "Người dùng không tồn tại." });
      }

      const {
        page = 1,
        limit = 10,
        sort = "booking_status_id",
        order = "desc",
        status,
      } = req.query;
      // Tạo query tìm kiếm
      const query = {
        user_id: userId,
      };

      if (status) {
        query.booking_status_id = status;
      }

      // Sắp xếp
      const sortOption = {};
      if (sort === "status") {
        sortOption.booking_status_id = order === "asc" ? 1 : -1;
      } else {
        sortOption[sort] = order === "asc" ? 1 : -1;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [bookings, total] = await Promise.all([
        Booking.find(query)
          .sort(sortOption)
          .skip(skip)
          .limit(parseInt(limit))
          .populate([
            { path: "booking_status", select: "name" },
            { path: "booking_method", select: "name" },
            { path: "user", select: "-createdAt -updatedAt -status" },
            {
              path: "employee",
              select: "first_name last_name position department",
            },
            {
              path: "payment",
              select: "-metadata -createdAt, -updatedAt",
              populate: { path: "payment_method", select: "name" },
            },
            { path: "discount", select: "name type value start_date end_date" },
            {
              path: "booking_details",
              populate: [
                {
                  path: "room",
                  select: "name floor",
                  populate: [
                    {
                      path: "room_class_id",
                      select:
                        "-main_room_class_id -createdAt -updatedAt -description -status",
                    },
                    { path: "room_status_id", select: "name" },
                  ],
                },
                {
                  path: "services",
                  select: "service_id amount -booking_detail_id",
                  populate: {
                    path: "service_id",
                    select: "name price",
                  },
                },
              ],
            },
          ]),
        Booking.countDocuments(query),
      ]);

      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: "Không có đơn đặt phòng nào." });
      }

      res.status(200).json({
        message: "Lấy danh sách đơn đặt phòng theo người dùng thành công",
        data: bookings,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // === LẤY THÔNG TIN PHÒNG ĐẶT THEO ID ===
  getBookingById: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id).populate([
        { path: "booking_status", select: "name" },
        { path: "booking_method", select: "name" },
        { path: "user", select: "-createdAt -updatedAt -status" },
        {
          path: "employee",
          select: "first_name last_name position department",
        },
        {
          path: "payment",
          populate: { path: "payment_method", select: "name" },
        },
        { path: "discount", select: "name type value start_date end_date" },
        {
          path: "booking_details",
          populate: [
            {
              path: "room",
              select: "name floor",
              populate: [
                {
                  path: "room_class_id",
                  select:
                    "-main_room_class_id -createdAt -updatedAt -description -status",
                },
                { path: "room_status_id", select: "name" },
              ],
            },
            {
              path: "services",
              select: "service_id amount -booking_detail_id",
              populate: {
                path: "service_id",
                select: "name price",
              },
            },
          ],
        },
      ]);

      if (!booking) {
        return res.status(404).json({ message: "Đặt phòng không tồn tại." });
      }

      res.status(200).json({
        message: "Lấy thông tin đặt phòng thành công",
        data: booking,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === HỦY PHÒNG ĐẶT ===
  cancelBooking: async (req, res) => {
    try {
      const bookingId = req.params.id;
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Đặt phòng không tồn tại." });
      }
      if (booking.booking_status_id.toString() === "683fba8d351a96315d457679") {
        return res.status(400).json({
          message: "Đặt phòng đã được hủy, không thể hủy lại.",
        });
      }

      // Kiểm tra trạng thái đặt phòng hiện tại
      if (
        booking.booking_status_id.toString() === "683fba8d351a96315d457677" || // Đang chờ xử lý
        booking.booking_status_id.toString() === "683fba8d351a96315d457678" // Đã xác nhận
      ) {
        return res.status(400).json({
          message: "Không thể hủy đặt phòng trong trạng thái này.",
        });
      }

      // Cập nhật trạng thái đặt phòng thành "Đã hủy"
      booking.booking_status_id = "683fba8d351a96315d457679"; // ID của trạng thái "Đã hủy"
      booking.cancel_reason = req.body.cancel_reason || "Không có lý do";

      booking.cancel_date = new Date(); // Ngày hủy đặt phòng

      await booking.save();
      res.status(200).json({
        message: "Hủy đặt phòng thành công",
        data: booking,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === THAY ĐỔI TRẠNG THÁI ĐẶT PHÒNG ===
  updateBookingStatus: async (req, res) => {
    try {
      const bookingId = req.params.id;
      const { status } = req.body;

      // Kiểm tra trạng thái mới có hợp lệ không
      const validStatuses = await BookingStatus.find({}, "_id").then(
        (statuses) => statuses.map((s) => s._id.toString())
      );

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ." });
      }

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Đặt phòng không tồn tại." });
      }

      booking.booking_status_id = status;
      await booking.save();

      res.status(200).json({
        message: "Thay đổi trạng thái đặt phòng thành công",
        data: booking,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === TÍNH TOÁN TỔNG TIỀN PHÒNG ĐẶT ===
  calculateTotalPrice: async (req, res) => {
    try {
      const bookingId = req.params.id;
      const booking = await Booking.findById(bookingId).populate({
        path: "booking_details",
        populate: [
          {
            path: "services",
            populate: {
              path: "service_id",
              select: "name price",
            },
          },
        ],
      });

      if (!booking) {
        return res.status(404).json({ message: "Đặt phòng không tồn tại." });
      }

      let totalPrice = 0;
      // Tính tổng tiền phòng
      for (const detail of booking.booking_details) {
        totalPrice += detail.price_per_night * detail.nights;
        // Tính tiền dịch vụ nếu có
        if (detail.services && detail.services.length > 0) {
          for (const service of detail.services) {
            totalPrice += service.amount * service.service_id.price;
          }
        }
      }

      // Cộng phụ phí trẻ em nếu có
      if (booking.extra_fee) {
        totalPrice += booking.extra_fee;
      }

      booking.total_price = parseInt(totalPrice);
      await booking.save();

      res.status(200).json({
        message: "Tính toán tổng tiền thành công",
        total_price: totalPrice,
        data: booking,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = bookingController;
