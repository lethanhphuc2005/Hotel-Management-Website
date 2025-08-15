const Review = require("../models/review.model");
const Booking = require("../models/booking.model");
const { BookingDetail } = require("../models/bookingDetail.model");
const User = require("../models/user.model");
const Employee = require("../models/employee.model");
const RoomClass = require("../models/roomClass.model");
const { BookingStatus } = require("../models/status.model");
const mongoose = require("mongoose");

const reviewController = {
  // === KIỂM TRA ĐIỀU KIỆN ĐÁNH GIÁ ===
  validateReview: async (reviewData, reviewId) => {
    const {
      booking_id,
      room_class_id,
      content,
      employee_id,
      user_id,
      parent_id,
    } = reviewData;
    // Kiểm tra xem booking_id có tồn tại không
    const booking = await Booking.findById(booking_id).lean();
    if (!booking) {
      return { valid: false, message: "Đơn đặt phòng không hợp lệ." };
    }

    // Kiểm tra xem room_class_id có tồn tại không
    const roomClass = await RoomClass.findById(room_class_id).lean();
    if (!roomClass) {
      return { valid: false, message: "Loại phòng không hợp lệ." };
    }
    // Kiểm tra xem loại phòng có thuộc về đơn đặt phòng không
    const bookingDetails = await BookingDetail.find({ booking_id }).lean();
    const isRoomClassValid = bookingDetails.some(
      (detail) => detail.room_class_id.toString() === room_class_id.toString()
    );
    if (!isRoomClassValid) {
      return {
        valid: false,
        message: "Loại phòng không thuộc về đơn đặt phòng này.",
      };
    }

    // Kiểm tra xem employee_id có tồn tại không
    if (employee_id) {
      const employee = await Employee.findById(employee_id).lean();
      if (!employee) {
        return { valid: false, message: "Nhân viên không hợp lệ." };
      }
    }

    // Kiểm tra xem user_id có tồn tại không
    if (user_id) {
      const user = await User.findById(user_id).lean();
      if (!user) {
        return { valid: false, message: "Người dùng không hợp lệ." };
      }
      // Kiểm tra người dùng có phải là người đặt phòng không
      if (booking.user_id.toString() !== user_id.toString()) {
        return {
          valid: false,
          message: "Người dùng không phải là người đặt phòng này.",
        };
      }
    }

    // Kiểm tra xem parent_id có hợp lệ không (nếu có)
    if (parent_id) {
      const parentReview = await Review.findById(parent_id).lean();
      if (!parentReview) {
        return { valid: false, message: "Đánh giá cha không hợp lệ." };
      }
    }

    // Kiểm tra xem employee_id và user_id có cùng tồn tại không
    if (employee_id && user_id) {
      return {
        valid: false,
        message:
          "Không thể có cả employee_id và user_id trong cùng một đánh giá.",
      };
    }

    // Kiểm tra xem employee_id hoặc user_id có tồn tại không
    if (!employee_id && !user_id) {
      return {
        valid: false,
        message:
          "Phải có ít nhất một trong hai trường employee_id hoặc user_id.",
      };
    }

    // Kiểm tra xem nội dung đánh giá có hợp lệ không
    if (!content || content.trim() === "") {
      return {
        valid: false,
        message: "Nội dung đánh giá không được để trống.",
      };
    }

    return { valid: true };
  },

  // === LẤY DANH SÁCH ĐÁNH GIÁ ===
  getAllReviews: async (req, res) => {
    try {
      const {
        search = "",
        page = 1,
        limit = 10,
        sort = "createdAt",
        order = "desc",
        booking_id,
        employee_id,
        user_id,
        status,
        rating,
      } = req.query;

      const query = {};
      if (search) {
        query.content = { $regex: search, $options: "i" };
      }

      if (rating) {
        query.rating = parseInt(rating);
      }

      if (status) {
        query.status = status;
      }

      if (booking_id) {
        query.booking_id = booking_id;
      }

      if (employee_id) {
        query.employee_id = employee_id;
      }

      if (user_id) {
        query.user_id = user_id;
      }

      const sortOptions = {};
      if (sort === "status") {
        sortOptions.status = order === "asc" ? 1 : -1;
      } else {
        sortOptions[sort] = order === "asc" ? 1 : -1;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [reviews, total] = await Promise.all([
        Review.find(query)
          .populate("booking room_class user employee")
          .sort(sortOptions)
          .skip(skip)
          .limit(parseInt(limit)),
        Review.countDocuments(query),
      ]);

      if (!reviews || reviews.length === 0) {
        return res.status(404).json({ message: "Không có đánh giá nào." });
      }

      res.status(200).json({
        message: "Lấy danh sách đánh giá thành công.",
        data: reviews,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // === LẤY DANH SÁCH ĐÁNH GIÁ CHO USER ===
  getAllReviewsForUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const {
        search = "",
        page = 1,
        limit = 10,
        sort = "createdAt",
        order = "desc",
        booking_id,
        rating,
      } = req.query;

      const query = { status: true, user_id: userId };
      if (search) {
        query.content = { $regex: search, $options: "i" };
      }

      if (rating) {
        query.rating = parseInt(rating);
      }

      if (booking_id) {
        query.booking_id = booking_id;
      }

      const sortOptions = {};
      sortOptions[sort] = order === "asc" ? 1 : -1;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [reviews, total] = await Promise.all([
        Review.find(query)
          .populate("booking room_class user employee")
          .sort(sortOptions)
          .skip(skip)
          .limit(parseInt(limit)),
        Review.countDocuments(query),
      ]);

      if (!reviews || reviews.length === 0) {
        return res.status(404).json({ message: "Không có đánh giá nào." });
      }

      res.status(200).json({
        message: "Lấy danh sách đánh giá thành công.",
        data: reviews,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // === LẤY DANH SÁCH ĐÁNH GIÁ THEO ID LOẠI PHÒNG ===
  getReviewsByRoomClassId: async (req, res) => {
    try {
      const roomId = req.params.roomId;
      const {
        search = "",
        page = 1,
        limit = 10,
        sort = "createdAt",
        order = "desc",
        booking_id,
        rating,
      } = req.query;

      const query = { status: true, room_class_id: roomId };
      if (search) {
        query.content = { $regex: search, $options: "i" };
      }

      if (rating) {
        query.rating = parseInt(rating);
      }

      if (booking_id) {
        query.booking_id = booking_id;
      }

      const sortOptions = {};
      sortOptions[sort] = order === "asc" ? 1 : -1;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [reviews, total, avgRatingResult] = await Promise.all([
        Review.find(query)
          .populate("booking room_class user employee")
          .sort(sortOptions)
          .skip(skip)
          .limit(parseInt(limit)),
        Review.countDocuments(query),
        Review.aggregate([
          {
            $match: {
              status: true,
              room_class_id: new mongoose.Types.ObjectId(roomId),
            },
          },
          { $group: { _id: null, averageRating: { $avg: "$rating" } } },
        ]),
      ]);

      if (!reviews || reviews.length === 0) {
        return res.status(404).json({ message: "Không có đánh giá nào." });
      }

      const averageRating = avgRatingResult[0]?.averageRating || 0;

      res.status(200).json({
        message: "Lấy danh sách đánh giá thành công.",
        data: reviews,
        pagination: {
          total,
          averageRating: parseFloat(averageRating.toFixed(1)), // Làm tròn 1 số thập phân
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // === LẤY DANH SÁCH ĐÁNH GIÁ THEO ID ===
  getReviewById: async (req, res) => {
    try {
      const { id } = req.params;

      const review = await Review.findById(id).populate(
        "booking room_class user employee"
      );

      if (!review) {
        return res.status(404).json({ message: "Đánh giá không tồn tại." });
      }

      if (!review || review.length === 0) {
        return res.status(404).json({ message: "Không có đánh giá nào." });
      }
      res.status(200).json({
        message: "Lấy đánh giá thành công.",
        data: review, // Chỉ trả về đánh giá gốc
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // === THÊM ĐÁNH GIÁ ===
  addReview: async (req, res) => {
    try {
      const { booking_id, user_id, parent_id, room_class_id } = req.body;
      const newReview = new Review(req.body);
      const validation = await reviewController.validateReview(newReview);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      const booking = await Booking.findById(newReview.booking_id);
      const validBookingStatus = await BookingStatus.findOne({
        code: "CHECKED_OUT",
      }).lean();

      if (
        booking.booking_status_id.toString() !==
        validBookingStatus._id.toString()
      ) {
        return res
          .status(400)
          .json({ message: "Chỉ được đánh giá sau khi hoàn tất lưu trú." });
      }

      // 4. Kiểm tra ngày check-out đã qua chưa
      const currentDate = new Date();
      if (new Date(booking.actual_check_in_date) > currentDate) {
        return res
          .status(400)
          .json({ message: "Chưa thể đánh giá trước khi hoàn tất lưu trú." });
      }

      // 5. Kiểm tra xem người dùng đã đánh giá booking này chưa
      // Nếu là user_id thì chỉ cho phép 1 review/booking/user
      if (user_id && !parent_id) {
        const existingReview = await Review.findOne({
          booking_id,
          user_id,
          room_class_id,
          status: true,
        }).lean();
        if (existingReview) {
          return res
            .status(400)
            .json({ message: "Bạn đã đánh giá đặt phòng này rồi." });
        }
      }
      // Nếu là employee_id thì cho phép nhiều review

      const savedReview = await newReview.save();

      res.status(201).json({
        message: "Thêm đánh giá thành công.",
        data: savedReview,
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // === CẬP NHẬT NỘI DUNG ĐÁNH GIÁ ===
  updateReview: async (req, res) => {
    try {
      const { id } = req.params;
      const { rating, content } = req.body;

      const reviewToUpdate = await Review.findById(id);
      if (!reviewToUpdate) {
        return res.status(404).json({ message: "Đánh giá không tồn tại." });
      }

      // Chỉ cho phép cập nhật trường content và rating
      const updatedData = { ...reviewToUpdate.toObject(), rating, content };

      const validation = await reviewController.validateReview(updatedData, id);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      reviewToUpdate.content = content;
      reviewToUpdate.rating = rating;
      const updatedReview = await reviewToUpdate.save();

      res.status(200).json({
        message: "Cập nhật nội dung đánh giá thành công.",
        data: updatedReview,
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // === KÍCH HOẠT/ VÔ HIỆU HÓA ĐÁNH GIÁ ===
  toggleReviewStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({ message: "Đánh giá không tồn tại." });
      }

      // Chuyển đổi trạng thái đánh giá
      review.status = !review.status;
      const updatedReview = await review.save();
      res.status(200).json({
        message: "Cập nhật trạng thái đánh giá thành công.",
        data: updatedReview,
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // === XÓA ĐÁNH GIÁ ===
  deleteReview: async (req, res) => {
    try {
      const { id } = req.params;
      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({ message: "Đánh giá không tồn tại." });
      }

      // Xóa đánh giá
      await Review.findByIdAndDelete(id);
      res.status(200).json({ message: "Xóa đánh giá thành công." });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

module.exports = reviewController;
