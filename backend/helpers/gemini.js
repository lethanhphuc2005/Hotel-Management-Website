const { GoogleGenerativeAI } = require("@google/generative-ai");
dotenv = require("dotenv").config();
const RoomClass = require("../models/roomClass.model");
const Booking = require("../models/booking.model");
const { BookingDetail } = require("../models/bookingDetail.model");
const Room = require("../models/room.model");
const { Feature } = require("../models/feature.model");
const Service = require("../models/service.model");
const SearchLog = require("../models/searchLog.model");
const removeVietnameseTones = require("../utils/removeVietnameseTones");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: { temperature: 0, topK: 1, topP: 1, maxOutputTokens: 512 },
});

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
            - Xem thêm: http://localhost:3000/room-class/${room._id}`
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

const normalizeArray = (arr) =>
  arr.map((str) => removeVietnameseTones(str).toLowerCase().trim());

const fetchSuggestionsFromGemini = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Bạn chưa đăng nhập" });
    }

    // 1. Lấy các từ khóa tìm kiếm gần đây (đã chuẩn hóa)
    const logs = await SearchLog.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(30);

    const keywords = [...new Set(logs.map((log) => log.normalized_keyword))];
    if (keywords.length === 0) {
      return res.status(200).json({ message: "Không có từ khóa để gợi ý." });
    }

    // 2. Lấy danh sách tên/description của phòng
    const rooms = await RoomClass.find({ status: true }).select(
      "name description"
    );
    const roomNames = rooms.map((room) => `${room.name} - ${room.description}`);

    // 3. Prompt gửi Gemini
    const prompt = `
    📌 Dưới đây là danh sách từ khóa người dùng đã tìm kiếm gần đây:
    ${keywords.map((kw, i) => `${i + 1}. ${kw}`).join("\n")}

    📂 Dữ liệu hệ thống hiện có (tên + mô tả các loại phòng):
    ${roomNames.map((r, i) => `- ${r}`).join("\n")}

    🎯 Nhiệm vụ của bạn:
    Phân tích các từ khóa và đưa ra gợi ý các loại phòng phù hợp với sở thích người dùng.

    ❗Yêu cầu:
    - Trả về ÍT NHẤT 3 loại phòng.
    - Mỗi tên phòng là 1 chuỗi từ danh sách hệ thống.
    - Trả kết quả DƯỚI DẠNG JSON THUẦN theo định dạng sau:

    {
      "rooms": ["Deluxe hướng biển", "Suite cao cấp", "Phòng gia đình"]
    }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 4. Parse JSON từ response
    const match =
      text.match(/```json([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/);
    const rawJson = match ? (match[1] || match[0]).trim() : text;
    const parsed = JSON.parse(rawJson);

    // 5. Chuẩn hóa kết quả gợi ý
    const normalizedRooms = normalizeArray(parsed.rooms || []);

    // 6. Tìm các phòng khớp với từ gợi ý (gần đúng)
    const roomClasses = rooms.filter((room) => {
      const name = removeVietnameseTones(room.name).toLowerCase();
      const desc = removeVietnameseTones(room.description).toLowerCase();
      return normalizedRooms.some(
        (kw) => name.includes(kw) || desc.includes(kw)
      );
    });

    // 7. Lấy chi tiết phòng có `images`, `features`
    const fullRoomClasses = await RoomClass.find({
      _id: { $in: roomClasses.map((r) => r._id) },
    }).populate([
      {
        path: "images",
        select: "url",
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
    ]);

    return res.json({
      roomClasses: fullRoomClasses,
      rawResponse: text,
    });
  } catch (err) {
    console.error("Gemini suggestion error:", err);
    res.status(500).json({
      error: "Lỗi khi lấy gợi ý AI",
      message: err.message,
    });
  }
};

module.exports = {
  generateResponseWithDB,
  fetchSuggestionsFromGemini,
};
