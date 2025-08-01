const Booking = require("../models/booking.model");
const Room = require("../models/room.model");
const { BookingStatus, RoomStatus } = require("../models/status.model");
const User = require("../models/user.model");

const getDashboardOverview = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // 1. Doanh thu hôm nay
    const checkedOutStatus = await BookingStatus.findOne({
      code: "CHECKED_OUT",
    })
      .select("_id")
      .lean();
    const todayBookings = await Booking.find({
      actual_check_out_date: { $gte: today, $lt: tomorrow },
      booking_status_id: checkedOutStatus._id,
    });

    const revenueToday = todayBookings.reduce(
      (sum, b) => sum + (b.total_price || 0),
      0
    );

    // 2. Số booking hôm nay
    const cancelledStatus = await BookingStatus.findOne({
      code: "CANCELLED",
    })
      .select("_id")
      .lean();

    const bookingsToday = await Booking.countDocuments({
      booking_date: { $gte: today, $lt: tomorrow },
      booking_status_id: { $ne: cancelledStatus._id },
    });

    // 3. Công suất phòng hiện tại
    const bookedStatus = await RoomStatus.findOne({
      code: "BOOKED",
    });
    const totalRooms = await Room.countDocuments();

    const occupiedRooms = await Room.countDocuments({
      room_status_id: bookedStatus._id,
    });

    const occupancyRate =
      totalRooms === 0 ? 0 : Math.round((occupiedRooms / totalRooms) * 100);

    // 4. Doanh thu theo tháng (7 tháng gần nhất)
    const revenueByMonth = [];
    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setMonth(start.getMonth() - i);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0); // Lấy ngày cuối cùng của tháng
      end.setHours(23, 59, 59, 999);

      const monthlyBookings = await Booking.find({
        booking_date: { $gte: start, $lte: end },
        booking_status_id: checkedOutStatus._id,
      })
        .select("total_price booking_date")
        .lean();

      const monthlyRevenue = monthlyBookings.reduce(
        (sum, b) => sum + (b.total_price || 0),
        0
      );
      revenueByMonth.push(monthlyRevenue);
    }
    // 5. Tổng số người đang lưu trú (CHECKED_IN)
    const checkedInStatus = await BookingStatus.findOne({ code: "CHECKED_IN" })
      .select("_id")
      .lean();

    let totalUsers = 0;
    if (checkedInStatus) {
      const result = await Booking.aggregate([
        {
          $match: {
            booking_status_id: checkedInStatus._id,
            actual_check_in_date: { $gte: today, $lt: tomorrow },
            actual_check_out_date: null, // vẫn còn lưu trú
          },
        },
        {
          $group: {
            _id: null,
            totalGuests: {
              $sum: { $add: ["$adult_amount", "$child_amount"] }, // đếm cả trẻ em
            },
          },
        },
      ]);

      totalUsers = result.length > 0 ? result[0].totalGuests : 0;
    }

    res.json({
      totalUsers,
      revenueToday,
      bookingsToday,
      occupancyRate,
      revenueByMonth,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getBookingStatusStatistics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);

    const statuses = await BookingStatus.find({ status: true })
      .select("_id code")
      .lean();

    const statusData = {};

    for (const status of statuses) {
      let todayFilter = { booking_status_id: status._id };
      let yesterdayFilter = { booking_status_id: status._id };

      // --- Hôm nay ---
      if (status.code === "CHECKED_IN") {
        todayFilter.actual_check_in_date = { $gte: today, $lt: tomorrow };
      } else if (status.code === "CHECKED_OUT") {
        todayFilter.actual_check_out_date = { $gte: today, $lt: tomorrow };
      } else {
        todayFilter.booking_date = { $gte: today, $lt: tomorrow };
      }

      // --- Hôm qua ---
      if (status.code === "CHECKED_IN") {
        yesterdayFilter.actual_check_in_date = { $lte: yesterday };
      } else if (status.code === "CHECKED_OUT") {
        yesterdayFilter.actual_check_out_date = { $gte: yesterday, $lt: today };
      } else {
        yesterdayFilter.booking_date = { $gte: yesterday, $lt: today };
      }

      const todayCount = await Booking.countDocuments(todayFilter);
      const yesterdayCount = await Booking.countDocuments(yesterdayFilter);
      const difference = todayCount - yesterdayCount;
      const percentageChange =
        yesterdayCount === 0
          ? todayCount > 0
            ? 100
            : 0
          : ((difference / yesterdayCount) * 100).toFixed(2);

      statusData[status.code] = {
        today: todayCount,
        yesterday: yesterdayCount,
        difference,
        percentageChange: Number(percentageChange),
      };
    }

    res.json({
      success: true,
      data: statusData,
    });
  } catch (err) {
    console.error("Error in getBookingStatusStatistics:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getCancelRateByDate = async (req, res) => {
  try {
    let { from, to } = req.query;

    // Nếu không có tham số từ và đến, sử dụng khoảng thời gian 30 ngày trước
    if (!from || !to) {
      const today = new Date();
      to = today.toISOString().slice(0, 10);
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);
      from = startDate.toISOString().slice(0, 10);
    }

    const startDate = new Date(from);
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999); // bao gồm cả ngày cuối

    // lấy id của trạng thái bị huỷ
    const cancelledStatus = await BookingStatus.findOne({ code: "CANCELLED" })
      .select("_id")
      .lean();

    // lấy toàn bộ đơn trong khoảng thời gian
    const bookings = await Booking.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const dateMap = {};

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateKey = d.toISOString().slice(0, 10);
      dateMap[dateKey] = { total: 0, cancelled: 0 };
    }

    bookings.forEach((booking) => {
      const dateKey = new Date(booking.createdAt).toISOString().slice(0, 10);
      if (dateMap[dateKey]) {
        dateMap[dateKey].total += 1;
        if (String(booking.booking_status_id) === String(cancelledStatus._id)) {
          dateMap[dateKey].cancelled += 1;
        }
      }
    });

    const result = Object.entries(dateMap).map(([date, data]) => ({
      date,
      cancelRate:
        data.total > 0 ? +(data.cancelled / data.total).toFixed(2) : 0,
    }));

    res.json(result);
  } catch (error) {
    console.error("Error getting cancel rate:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getDashboardOverview,
  getBookingStatusStatistics,
  getCancelRateByDate,
};
