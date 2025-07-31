const BookingMethod = require("../models/bookingMethod.model");
const Booking = require("../models/booking.model");
const { BookingStatus, RoomStatus } = require("../models/status.model");
const {
  BookingDetail,
  Booking_Detail_Service,
} = require("../models/bookingDetail.model");
const User = require("../models/user.model");
const Employee = require("../models/employee.model");
const RoomClass = require("../models/roomClass.model");
const Discount = require("../models/discount.model");
const Service = require("../models/service.model");
const Room = require("../models/room.model");
const walletController = require("./wallet.controller");
const mailSender = require("../helpers/mail.sender");
const { notificationEmail } = require("../config/mail");
const calculateCancellationFee = require("../utils/cancellationPolicy");
const Payment = require("../models/payment.model");
const mongoose = require("mongoose");

const bookingController = {
  // === KIỂM TRA ĐIỀU KIỆN PHƯƠNG THỨC ĐẶT PHÒNG ===
  validateBooking: async (bookingData, bookingId) => {
    const {
      full_name,
      phone_number,
      email,
      check_in_date,
      check_out_date,
      adult_amount,
      child_amount,
      booking_method_id,
      booking_status_id,
      booking_details,
      discount_id,
      employee_id,
    } = bookingData;

    // Kiểm tra thông tin bắt buộc
    if (!full_name || full_name.trim() === "") {
      return { valid: false, message: "Vui lòng nhập họ tên." };
    }
    if (!phone_number || phone_number.trim() === "") {
      return { valid: false, message: "Vui lòng nhập số điện thoại." };
    }
    if (!email || email.trim() === "") {
      return { valid: false, message: "Vui lòng nhập email." };
    }
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

    // Kiểm tra nhân viên
    if (employee_id) {
      const checkEmployee = await Employee.findById(employee_id);
      if (!checkEmployee) {
        return { valid: false, message: "Nhân viên không tồn tại." };
      }
    }

    // Ngày đặt phòng lấy từ ngày hiện tại
    // Đặt booking_date là ngày hiện tại với giờ 0:00
    const now = new Date();
    const booking_date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
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
    if (!booking_details || booking_details.length === 0) {
      return { valid: false, message: "Vui lòng thêm chi tiết đặt phòng." };
    }

    // Kiếm tra khuyến mãi (nếu có)
    if (discount_id) {
      const discountIds = Array.isArray(discount_id)
        ? discount_id
        : [discount_id];

      // Tìm tất cả khuyến mãi hợp lệ
      const now = new Date();
      const validDiscounts = await Discount.find({
        _id: { $in: discountIds },
        status: true,
        valid_from: { $lte: now },
        valid_to: { $gte: now },
      });

      if (validDiscounts.length !== discountIds.length) {
        return {
          valid: false,
          message: "Một hoặc nhiều mã khuyến mãi không hợp lệ hoặc đã hết hạn.",
        };
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

    // Kiểm tra chi tiết đặt phòng có hợp lệ không
    let totalCapacity = 0;

    if (Array.isArray(child_amount)) {
      totalChildren = child_amount.length;
    } else if (typeof child_amount === "number") {
      totalChildren = child_amount;
    }

    const totalPeople = (adult_amount || 0) + totalChildren;

    for (const detail of booking_details) {
      if (!detail.room_class_id) {
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
      const roomClass = await RoomClass.findById(detail.room_class_id);
      if (!roomClass) {
        return {
          valid: false,
          message: `Loại phòng ${detail.room_class_id} không tồn tại.`,
        };
      }
      totalCapacity += roomClass.room_class_capacity;

      // Tính tổng tiền phòng

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
    if (totalPeople > totalCapacity) {
      return {
        valid: false,
        message: `Tổng số người (${totalPeople}) vượt quá sức chứa cho phép (${totalCapacity}).`,
      };
    }

    // Kiểm tra xem user có đơn đặt nào đang chờ xử lý không
    const user_id = bookingData.user_id || null; // Lấy user_id từ bookingData
    if (!user_id) {
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
    }
    return { valid: true };
  },

  // === THÊM PHÒNG ĐẶT MỚI ===
  addBooking: async (req, res) => {
    try {
      const validation = await bookingController.validateBooking(req.body);

      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }
      const { booking_details } = req.body;
      const newBooking = new Booking(req.body);
      // Thêm booking booking_details
      if (booking_details && booking_details.length > 0) {
        for (const detail of booking_details) {
          const bookingDetail = new BookingDetail({
            booking_id: newBooking._id,
            room_class_id: detail.room_class_id,
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

      const savedBooking = await newBooking.save();

      const populatedBooking = await Booking.findById(
        savedBooking._id
      ).populate([
        {
          path: "booking_details",
          populate: [
            {
              path: "room_class_id",
              select: "name",
            },
            {
              path: "services",
              select: "service_id amount used_at",
              populate: {
                path: "service_id",
                select: "name price",
              },
            },
          ],
        },
      ]);

      // Gửi mail thông tin đặt phòng (nếu cần)
      try {
        const bookingMessage = `
            <h2>Thông tin đặt phòng</h2>
            <p><strong>Họ tên:</strong> ${populatedBooking.full_name}</p>
            <p><strong>Số điện thoại:</strong> ${
              populatedBooking.phone_number
            }</p>
            <p><strong>Email:</strong> ${populatedBooking.email}</p>
            <p><strong>Ngày đặt:</strong> ${populatedBooking.booking_date.toLocaleDateString()}</p>
            <p><strong>Ngày nhận phòng:</strong> ${populatedBooking.check_in_date.toLocaleDateString()}</p>
            <p><strong>Ngày trả phòng:</strong> ${populatedBooking.check_out_date.toLocaleDateString()}</p>
            <p><strong>Số lượng người lớn:</strong> ${
              populatedBooking.adult_amount
            }</p>
            <p><strong>Số lượng trẻ em:</strong> ${
              populatedBooking.child_amount
            }</p>
            <p><strong>Thông tin chi tiết đặt phòng:</strong></p>
            <ul>
              ${populatedBooking.booking_details
                .map(
                  (detail) => `
                <li>
                  Phòng: ${
                    detail.room_class_id.name
                  }, Giá mỗi đêm: ${detail.price_per_night.toLocaleString(
                    "vi-VN"
                  )} VND, Số đêm: ${detail.nights}
                  ${
                    detail.services && detail.services.length > 0
                      ? `
                    <ul>
                      ${detail.services
                        .map(
                          (service) => `
                        <li>Dịch vụ: ${service.service_id.name}, Số lượng: ${service.amount}, Giá: ${service.price}</li>
                      `
                        )
                        .join("")}
                    </ul>`
                      : ""
                  }
                </li>`
                )
                .join("")}
            </ul>
            <p><strong>Tổng tiền:</strong> ${populatedBooking.total_price.toLocaleString(
              "vi-VN"
            )} VND</p>
          `;
        mailSender({
          email: populatedBooking.email,
          subject: notificationEmail.subject,
          html: notificationEmail.html(bookingMessage),
        });
      } catch (error) {
        console.error("Gửi email thông tin đặt phòng thất bại:", error);
        return res.status(500).json({
          message: "Gửi email thông tin đặt phòng thất bại",
          error: error.message,
        });
      }
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
        search = "",
        page = 1,
        limit = 10,
        sort = "booking_status_id",
        order = "desc",
        user,
        status,
        method,
        payment_status,
        check_in_date,
        check_out_date,
        booking_date,
      } = req.query;

      // Tạo query tìm kiếm
      const query = {};
      if (search) {
        const searchRegex = new RegExp(search, "i");
        const isObjectId = mongoose.Types.ObjectId.isValid(search);

        query.$or = [
          ...(isObjectId ? [{ _id: new mongoose.Types.ObjectId(search) }] : []),
          { full_name: { $regex: searchRegex } },
          { phone_number: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
        ];
      }

      if (status) {
        query.booking_status_id = status;
      }

      if (method) {
        query.booking_method_id = method;
      }

      if (payment_status) {
        if (payment_status === "paid") {
          query.payment_status = "PAID";
        } else if (payment_status === "unpaid") {
          query.payment_status = "UNPAID";
        } else if (payment_status === "refunded") {
          query.payment_status = "REFUNDED";
        }
      }

      if (check_in_date) {
        const checkInDate = new Date(check_in_date);
        query.check_in_date = { $gte: checkInDate };
      }

      if (check_out_date) {
        const checkOutDate = new Date(check_out_date);
        query.check_out_date = { $lte: checkOutDate };
      }

      if (booking_date) {
        const bookingDate = new Date(booking_date);
        // Đặt giờ về 0:00:00 để lấy đúng ngày
        bookingDate.setHours(0, 0, 0, 0);
        query.booking_date = {
          $gte: bookingDate,
          $lt: new Date(bookingDate.getTime() + 24 * 60 * 60 * 1000), // Chỉ lấy ngày đó
        };
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
          .populate(
            "booking_status booking_method user employee payments discounts booking_details"
          ),
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

      const checkUser = await User.findById(userId).lean();
      if (!checkUser) {
        return res.status(404).json({ message: "Người dùng không tồn tại." });
      }

      const {
        page = 1,
        limit = 10,
        sort = "createdAt",
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
          .populate(
            "booking_status booking_method user employee payments discounts booking_details"
          ),
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
      const booking = await Booking.findById(req.params.id).populate(
        "booking_status booking_method user employee payments discounts booking_details"
      );
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

      const cancelBookingStatus = await BookingStatus.findOne({
        code: "CANCELLED",
      })
        .select("_id")
        .lean();

      // Đã hủy trước đó
      if (
        booking.booking_status_id.toString() ===
        cancelBookingStatus._id.toString()
      ) {
        return res.status(400).json({
          message: "Đặt phòng đã được huỷ trước đó.",
        });
      }

      const now = new Date();
      const checkInDate = new Date(booking.check_in_date);
      // Kiểm tra trạng thái thanh toán
      const pendingPayment = await Payment.findOne({
        booking_id: bookingId,
        status: "PENDING",
      }).lean();

      let refundAmount = booking.total_price;
      if (pendingPayment) refundAmount = 0; // Nếu có thanh toán đang chờ, không hoàn tiền

      // Tính phí hủy
      const { feePercent, feeAmount } = calculateCancellationFee(
        checkInDate,
        now,
        refundAmount,
        booking.createdAt
      );

      const { role } = req.user;
      if (role !== "user") {
        booking.employee_id = req.user.id; // Gán nhân viên xử lý nếu không phải user
      }

      booking.booking_status_id = cancelBookingStatus._id;
      booking.cancel_date = now;
      booking.cancel_reason = req.body.cancel_reason || "Không cung cấp lý do";
      booking.cancellation_fee = feeAmount;

      await booking.save();

      // Hoàn tiền vào ví người dùng nếu có
      if (booking.payment_status === "PAID") {
        const refundAmount = booking.total_price - feeAmount;
        booking.payment_status = "REFUNDED";
        await booking.save();

        if (refundAmount > 0) {
          await walletController.refundInternal(
            booking.user_id,
            refundAmount,
            `Hoàn tiền đặt phòng ${bookingId} sau khi huỷ`
          );
        }

        return res.status(200).json({
          message: `Huỷ thành công. Phí huỷ: ${feeAmount.toLocaleString(
            "vi-VN"
          )} VNĐ (${feePercent}%)`,
          data: booking,
          refund: {
            amount: refundAmount,
            note: "Số tiền còn lại đã được hoàn vào ví",
          },
        });
      } else {
        return res.status(200).json({
          message: `Huỷ thành công.`,
          data: booking,
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi huỷ đặt phòng", error });
    }
  },

  // === XEM PHÍ HỦY PHÒNG ===
  previewCancellationFee: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking)
        return res.status(404).json({ message: "Không tìm thấy đặt phòng" });

      const cancelBookingStatus = await BookingStatus.findOne({
        code: "CANCELLED",
      })
        .select("_id")
        .lean();

      if (
        booking.booking_status_id.toString() ===
        cancelBookingStatus._id.toString()
      ) {
        return res.status(400).json({ message: "Đặt phòng đã bị huỷ" });
      }
      if (booking.payment_status === "UNPAID") {
        return res.status(200).json({
          message: "Đặt phòng chưa thanh toán, không có phí huỷ",
          data: {
            can_cancel: true,
            fee_percent: 0,
            fee_amount: 0,
          },
        });
      }

      const now = new Date();
      const checkIn = new Date(booking.check_in_date);
      const { feePercent, feeAmount } = calculateCancellationFee(
        checkIn,
        now,
        booking.total_price,
        booking.createdAt
      );
      res.status(200).json({
        message: `Nếu bạn huỷ bây giờ, bạn sẽ mất ${feeAmount.toLocaleString(
          "vi-VN"
        )} VNĐ (${feePercent}%)`,
        data: {
          can_cancel: true,
          fee_percent: feePercent,
          fee_amount: feeAmount,
        },
      });
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi xem phí huỷ", error: err });
    }
  },

  // === XÁC NHẬN ĐẶT PHÒNG ===
  confirmBooking: async (req, res) => {
    try {
      const user = req.user;
      const bookingId = req.params.id;
      const { roomAssignments } = req.body;

      if (!Array.isArray(roomAssignments) || roomAssignments.length === 0) {
        return res
          .status(400)
          .json({ message: "Thiếu danh sách phòng cần gán." });
      }

      // Lấy booking (cần dùng để sửa & save -> KHÔNG dùng lean)
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy đơn đặt phòng." });
      }

      // Lấy id trạng thái CONFIRMED (dùng lean vì chỉ cần giá trị)
      const confirmedStatus = await BookingStatus.findOne({ code: "CONFIRMED" })
        .select("_id")
        .lean();
      if (!confirmedStatus) {
        return res.status(500).json({ message: "Thiếu trạng thái CONFIRMED" });
      }

      // Lấy sẵn ID trạng thái BOOKED một lần duy nhất
      const bookedStatus = await RoomStatus.findOne({ code: "BOOKED" })
        .select("_id")
        .lean();
      if (!bookedStatus) {
        return res.status(500).json({ message: "Thiếu trạng thái BOOKED" });
      }

      for (const assign of roomAssignments) {
        const { detail_id, room_id } = assign;

        if (!detail_id || !room_id) continue;

        // Kiểm tra room tồn tại (dùng lean để nhẹ hơn)
        const room = await Room.findById(room_id).select("_id").lean();
        if (!room) {
          return res
            .status(400)
            .json({ message: `Phòng không tồn tại: ${room_id}` });
        }

        // Cập nhật room_id cho booking_detail (KHÔNG cần lean, vì không dùng data trả về)
        await BookingDetail.findByIdAndUpdate(detail_id, {
          room_id: room_id,
        });

        // Cập nhật trạng thái phòng (KHÔNG cần lean)
        await Room.findByIdAndUpdate(room_id, {
          room_status_id: bookedStatus._id,
        });
      }

      // Cập nhật booking
      booking.employee_id = user.id;
      booking.booking_status_id = confirmedStatus._id;
      await booking.save();

      res.json({
        message: "Đã xác nhận đơn và cập nhật phòng thành công.",
        data: booking,
      });
    } catch (error) {
      console.error("❌ Error confirmBooking:", error);
      res.status(500).json({ message: "Lỗi xác nhận đơn." });
    }
  },

  // === CHECK IN PHÒNG ===
  checkInBooking: async (req, res) => {
    try {
      const user = req.user;
      const bookingId = req.params.id;
      const { identity } = req.body; // { type, number, representative_name }

      if (!identity || !identity.number || !identity.representative_name) {
        return res
          .status(400)
          .json({ message: "Thiếu thông tin giấy tờ nhận phòng." });
      }

      // Lấy booking (lean để nhẹ, nhưng cần update nên lấy _id)
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Đặt phòng không tồn tại." });
      }

      // Kiểm tra trạng thái hiện tại có phải CONFIRMED không
      const confirmedStatus = await BookingStatus.findOne({ code: "CONFIRMED" })
        .select("_id")
        .lean();

      if (
        !confirmedStatus ||
        !booking.booking_status_id.equals(confirmedStatus._id)
      ) {
        return res
          .status(400)
          .json({ message: "Chỉ có thể check-in đơn đã được xác nhận." });
      }

      const checkedInStatus = await BookingStatus.findOne({
        code: "CHECKED_IN",
      })
        .select("_id")
        .lean();
      if (!checkedInStatus) {
        return res.status(500).json({ message: "Thiếu trạng thái CHECKED_IN" });
      }

      booking.employee_id = user.id;
      booking.actual_check_in_date = new Date();
      booking.check_in_identity = identity;
      booking.booking_status_id = checkedInStatus._id;

      res.json({ message: "Đã check-in thành công.", data: updatedBooking });
    } catch (error) {
      console.error("❌ Error checkInBooking:", error);
      res.status(500).json({ message: "Lỗi khi check-in." });
    }
  },

  // === CHECK OUT PHÒNG ===
  checkOutBooking: async (req, res) => {
    try {
      const user = req.user;
      const bookingId = req.params.id;
      const { note } = req.body; // Ghi chú nếu có

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Đặt phòng không tồn tại." });
      }

      const checkedInStatus = await BookingStatus.findOne({
        code: "CHECKED_IN",
      })
        .select("_id")
        .lean();
      if (
        !checkedInStatus ||
        !booking.booking_status_id.equals(checkedInStatus._id)
      ) {
        return res
          .status(400)
          .json({ message: "Chỉ có thể check-out đơn đã check-in." });
      }

      const checkedOutStatus = await BookingStatus.findOne({
        code: "CHECKED_OUT",
      })
        .select("_id")
        .lean();
      if (!checkedOutStatus) {
        return res
          .status(500)
          .json({ message: "Thiếu trạng thái CHECKED_OUT" });
      }

      booking.employee_id = user.id;
      booking.actual_check_out_date = new Date();
      booking.check_out_note = note || "";
      booking.booking_status_id = checkedOutStatus._id;
      booking.payment_status = "PAID"; // Giả sử check-out thì thanh toán đã hoàn tất
      booking.check_in_identity = null; // Xoá thông tin giấy tờ check-in

      const updatedBooking = await booking.save();

      // Cập nhật trạng thái phòng về AVAILABLE
      const bookingDetails = await BookingDetail.find({ booking_id: bookingId })
        .select("room_id")
        .lean();
      const roomStatus = await RoomStatus.findOne({
        code: "AVAILABLE",
      })
        .select("_id")
        .lean();
      if (!roomStatus) {
        return res.status(500).json({ message: "Thiếu trạng thái AVAILABLE" });
      }
      for (const detail of bookingDetails) {
        if (detail.room_id) {
          await Room.findByIdAndUpdate(detail.room_id, {
            room_status_id: roomStatus._id,
          });
        }
      }

      res.json({ message: "Đã check-out thành công.", data: updatedBooking });
    } catch (error) {
      console.error("❌ Error checkOutBooking:", error);
      res.status(500).json({ message: "Lỗi khi check-out." });
    }
  },

  // === TÍNH TOÁN TỔNG TIỀN PHÒNG ĐẶT ===
  calculateTotalPrice: async (req, res) => {
    try {
      const bookingId = req.params.id;
      const booking = await Booking.findById(bookingId).populate(
        "booking_details"
      );

      if (!booking) {
        return res.status(404).json({ message: "Đặt phòng không tồn tại." });
      }

      let totalPrice = 0;
      // Tính tổng tiền phòng
      for (const detail of booking.booking_details) {
        totalPrice += (detail.price_per_night || 0) * (detail.nights || 0);
        // Tính tiền dịch vụ nếu có
        if (detail.services && detail.services.length > 0) {
          for (const service of detail.services) {
            if (service.service) {
              totalPrice += service.amount * service.service.price;
            }
          }
        }
      }

      // Cộng phụ phí trẻ em nếu có
      if (booking.extra_fee) {
        totalPrice += booking.extra_fee;
      }

      booking.total_price = Math.round(totalPrice);
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
