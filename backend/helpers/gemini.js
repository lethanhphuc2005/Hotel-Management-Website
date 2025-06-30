const { GoogleGenerativeAI } = require("@google/generative-ai");
dotenv = require("dotenv").config();
const RoomClass = require("../models/roomClass.model");
const Booking = require("../models/booking.model");
const { BookingDetail } = require("../models/bookingDetail.model");
const Room = require("../models/room.model");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const getFilteredRooms = async (filters) => {
  const { check_in_date, check_out_date } = filters;
  // Nếu không có ngày check-in/check-out thì lấy tất cả phòng đang hoạt động
  const query = { status: true };

  let roomClasses = await RoomClass.find(query).populate([
    {
      path: "main_room_class",
      select: "-status -createdAt -updatedAt",
      match: { status: true },
    },
    {
      path: "features",
      populate: {
        path: "feature_id",
        model: "feature",
        select: "-status -createdAt -updatedAt",
        match: { status: true },
      },
    },
    { path: "images", select: "url", match: { status: true } },
  ]);

  if (check_in_date && check_out_date) {
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);

    // Lấy tất cả booking nằm trong khoảng ngày check-in - check-out, trừ trạng thái huỷ
    const bookings = await Booking.find({
      check_in_date: { $lt: checkOut },
      check_out_date: { $gt: checkIn },
      booking_status_id: {
        $nin: ["683fba8d351a96315d457679", "683fba8d351a96315d457678"],
      },
    });
    const bookingIds = bookings.map((b) => b._id);
    // Lấy chi tiết booking của các booking trên, có room_id
    const bookingDetails = await BookingDetail.find({
      booking_id: { $in: bookingIds },
    }).populate({
      path: "room_id",
      select: "room_class_id",
    });

    // Đếm tổng phòng của từng loại
    const totalRoomsByClass = await Room.aggregate([
      {
        $group: {
          _id: "$room_class_id",
          total: { $sum: 1 },
        },
      },
    ]);

    // Map: room_class_id => tổng phòng
    const totalRoomsMap = {};
    totalRoomsByClass.forEach((r) => {
      totalRoomsMap[r._id.toString()] = r.total;
    });

    // Tạo map đếm số phòng đã book từng ngày theo từng loại phòng
    // Format: { room_class_id: { "yyyy-mm-dd": count } }
    const bookedCountMap = {};

    // Hàm helper lấy các ngày trong khoảng
    const getDatesBetween = (start, end) => {
      const dates = [];
      let current = new Date(start);
      while (current < end) {
        dates.push(current.toISOString().slice(0, 10)); // yyyy-mm-dd
        current.setDate(current.getDate() + 1);
      }
      return dates;
    };

    // Duyệt booking details, đếm phòng booked theo ngày và loại phòng
    bookingDetails.forEach((detail) => {
      const roomClassId = detail.room_id.room_class_id.toString();
      const booking = bookings.find((b) => b._id.equals(detail.booking_id));
      if (!booking) return;

      const bookedDates = getDatesBetween(
        booking.check_in_date,
        booking.check_out_date
      );

      if (!bookedCountMap[roomClassId]) bookedCountMap[roomClassId] = {};

      bookedDates.forEach((date) => {
        bookedCountMap[roomClassId][date] =
          (bookedCountMap[roomClassId][date] || 0) + 1;
      });
    });

    // Giữ lại roomClasses có phòng trống đủ cho toàn bộ khoảng thời gian
    roomClasses = roomClasses.filter((rc) => {
      const rcId = rc._id.toString();
      const totalRoom = totalRoomsMap[rcId] || 0;
      if (totalRoom === 0) return false; // Không có phòng

      const dates = getDatesBetween(checkIn, checkOut);

      // Kiểm tra từng ngày xem số phòng đã booked < tổng phòng không
      return dates.every((date) => {
        const bookedCount = bookedCountMap[rcId]?.[date] || 0;
        return bookedCount < totalRoom;
      });
    });
  }

  return roomClasses;
};

function sanitizeHistory(history) {
  return (Array.isArray(history) ? history : []).filter((m) => {
    const isValid =
      m &&
      typeof m === "object" &&
      !Array.isArray(m) &&
      (m.role === "user" || m.role === "model") &&
      Array.isArray(m.parts) &&
      m.parts.length > 0 &&
      typeof m.parts[0].text === "string";

    if (!isValid) {
      console.warn("Invalid history item detected:", m);
    }

    return isValid;
  });
}

function extractFiltersFromPrompt(prompt) {
  const filters = {};

  // Chuẩn hóa prompt về chữ thường
  const text = prompt.toLowerCase();

  // Tìm ngày theo định dạng dd/mm hoặc d/m
  const dateRegex = /(?:ngày\s*)?(\d{1,2})[\/\-](\d{1,2})/g;

  const matches = [...text.matchAll(dateRegex)];

  if (matches.length >= 1) {
    const toDateParts = matches[0];
    const fromDateParts = matches[1] || matches[0]; // nếu chỉ có 1 thì dùng làm cả from và to

    // Chuyển định dạng sang yyyy-mm-dd
    const formatDate = (d, m) => {
      const day = d.padStart(2, "0");
      const month = m.padStart(2, "0");
      return `2025-${month}-${day}`; // bạn có thể dùng năm động nếu cần
    };

    filters.check_out_date = formatDate(fromDateParts[1], fromDateParts[2]);
    filters.check_in_date = formatDate(toDateParts[1], toDateParts[2]);
  }

  return filters;
}

async function sendMessageWithRetry(chat, prompt, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await chat.sendMessage(prompt);
      return result.response.text();
    } catch (err) {
      if (i < retries - 1 && err.message?.includes("503")) {
        console.warn(`⚠️ Gemini quá tải, thử lại lần ${i + 2}...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        throw err;
      }
    }
  }
}

const generateResponseWithDB = async (req, res) => {
  const { prompt, history = [] } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res
      .status(400)
      .json({ response: "Thiếu hoặc sai định dạng prompt" });
  }

  if (
    !Array.isArray(history) ||
    history.some((h) => typeof h !== "object" || h === null)
  ) {
    return res
      .status(400)
      .json({ response: "History phải là mảng các object hợp lệ" });
  }

  try {
    const filters = extractFiltersFromPrompt(prompt);
    const rooms = await getFilteredRooms(filters);

    // Tạo system prompt thông minh
    const systemPrompt = `
      Bạn là trợ lý AI của khách sạn The Moon Hotel.
      Nhiệm vụ của bạn là tư vấn, giải thích chính sách và gợi ý các phòng phù hợp dựa trên nhu cầu của khách.

      📅 Khoảng thời gian được chọn: Từ ${filters.check_in_date} đến ${
      filters.check_out_date
    }

      📌 Danh sách các phòng hiện còn trống:
      ${rooms
        .map(
          (room, i) => `(${i + 1}) ${room.name}
            - Giá: ${room.price} VND/đêm
            - Giường: ${room.bed_amount}
            - Sức chứa: ${room.capacity}
            - View: ${room.view}
            - Xem thêm: http://localhost:3000/roomdetail/${room._id}`
        )
        .join("\n\n")}

        📋 Chính sách khách sạn:
        - Huỷ miễn phí trước 24h
        - Không hút thuốc trong phòng
        - Không mang theo thú cưng
        - Trẻ dưới 6 tuổi ở miễn phí nếu không dùng giường phụ
        - Trẻ từ 6-17 tuổi: +200.000 VND/đêm nếu có giường phụ
        - Giường phụ: 300.000 VND/đêm

        💬 Dưới đây là câu hỏi của khách:
        "${prompt}"
        `;

    // Lọc và chuẩn hoá lịch sử cũ
    const validHistory = sanitizeHistory(history).slice(-10);

    const chat = model.startChat({ history: validHistory });

    // Gửi prompt + system context
    const response = await sendMessageWithRetry(chat, systemPrompt);

    console.log("✅ Gemini response:", response);

    // Cập nhật lại lịch sử hội thoại
    const updatedHistory = [
      ...validHistory,
      { role: "user", parts: [{ text: prompt }] },
      { role: "model", parts: [{ text: response }] },
    ];

    return res.json({
      response,
      rooms,
      history: updatedHistory,
    });
  } catch (err) {
    console.error("❌ Lỗi trong generateResponseWithDB:", err);
    return res.status(500).json({
      response: "Lỗi khi lấy dữ liệu hoặc gọi AI",
      error: err.message || "Unknown error",
    });
  }
};

module.exports = {
  generateResponseWithDB,
};
