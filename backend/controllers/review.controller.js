const Review = require("../models/review.model");
const Booking = require("../models/booking.model");
const User = require("../models/user.model");
const Employee = require("../models/employee.model");

const reviewController = {
  // === XÂY DỰNG CẤU TRÚC CÂY ĐÁNH GIÁ ===
  // buildReviewTree: (reviews) => {
  //   const reviewMap = new Map();
  //   const reviewTree = [];
  //   reviews.forEach((review) => {
  //     reviewMap.set(review._id.toString(), {
  //       ...review.toObject(),
  //       replies: [],
  //     });
  //   });
  //   reviews.forEach((review) => {
  //     const reviewId = review._id.toString();
  //     const parentId = review.parent_id ? review.parent_id.toString() : null;
  //     if (parentId) {
  //       const parentComment = reviewMap.get(parentId);
  //       if (parentComment) {
  //         parentComment.replies.push(reviewMap.get(reviewId));
  //       }
  //     } else {
  //       reviewTree.push(reviewMap.get(reviewId));
  //     }
  //   });
  //   return reviewTree;
  // },

  // === KIỂM TRA ĐIỀU KIỆN ĐÁNH GIÁ ===
  validateReview: async (reviewData, reviewId) => {
    const { booking_id, content, employee_id, user_id, parent_id } = reviewData;

    // Kiểm tra xem booking_id có tồn tại không
    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return { valid: false, message: "Đơn đặt phòng không hợp lệ." };
    }

    // Kiểm tra xem employee_id có tồn tại không
    if (employee_id) {
      const employee = await Employee.findById(employee_id);
      if (!employee) {
        return { valid: false, message: "Nhân viên không hợp lệ." };
      }
    }

    // Kiểm tra xem user_id có tồn tại không
    if (user_id) {
      const user = await User.findById(user_id);
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
      const parentReview = await Review.findById(parent_id);
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
          .populate({
            path: "booking_id",
            select: "check_in_date check_out_date booking_status_id",
            populate: {
              path: "booking_status_id",
              select: "name",
            },
          })
          .populate("employee_id", "-password")
          .populate("user_id", "-password")
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
      const {
        search = "",
        page = 1,
        limit = 10,
        sort = "createdAt",
        order = "desc",
        booking_id,
        rating,
      } = req.query;

      const query = { status: true };
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
          .select("-status")
          .populate({
            path: "booking_id",
            select: "check_in_date check_out_date booking_status_id",
            populate: {
              path: "booking_status_id",
              select: "name",
            },
          })
          .populate("employee_id", "first_name last_name updatedAt")
          .populate("user_id", "first_name last_name createdAt updatedAt")
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

  // === LẤY DANH SÁCH ĐÁNH GIÁ THEO ID ===
  getReviewById: async (req, res) => {
    try {
      const { id } = req.params;

      const review = await Review.findById(id)
        .populate({
          path: "booking_id",
          select: "check_in_date check_out_date booking_status_id",
          populate: {
            path: "booking_status_id",
            select: "name",
          },
        })
        .populate("employee_id", "-password")
        .populate("user_id", "-password");
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
      const { booking_id, user_id } = req.body;
      const newReview = new Review(req.body);
      const validation = await reviewController.validateReview(newReview);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      const booking = await Booking.findById(newReview.booking_id);
      // 3. Kiểm tra trạng thái đặt phòng phải là "Đã hoàn tất"
      // (Giả sử bạn có một ID cụ thể cho trạng thái này, ví dụ: statusId_success)
      const statusId_success = "683fba8d351a96315d457678"; // <-- Thay bằng ID thực tế
      if (booking.booking_status_id.toString() !== statusId_success) {
        return res
          .status(400)
          .json({ message: "Chỉ được đánh giá sau khi hoàn tất lưu trú." });
      }

      // 4. Kiểm tra ngày check-out đã qua chưa
      const currentDate = new Date();
      if (new Date(booking.check_out_date) > currentDate) {
        return res
          .status(400)
          .json({ message: "Chưa thể đánh giá trước khi hoàn tất lưu trú." });
      }

      // 5. Kiểm tra xem người dùng đã đánh giá booking này chưa
      // Nếu là user_id thì chỉ cho phép 1 review/booking/user
      if (user_id) {
        const existingReview = await Review.findOne({ booking_id, user_id });
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
      const { content } = req.body;

      const reviewToUpdate = await Review.findById(id);
      if (!reviewToUpdate) {
        return res.status(404).json({ message: "Đánh giá không tồn tại." });
      }

      // Chỉ cho phép cập nhật trường content
      const updatedData = { ...reviewToUpdate.toObject(), content };

      const validation = await reviewController.validateReview(updatedData, id);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      reviewToUpdate.content = content;
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
