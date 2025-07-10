const { GoogleGenerativeAI } = require("@google/generative-ai");
dotenv = require("dotenv").config();
const RoomClass = require("../models/roomClass.model");
const Booking = require("../models/booking.model");
const { BookingDetail } = require("../models/bookingDetail.model");
const Room = require("../models/room.model");
const SearchLog = require("../models/searchLog.model");
const removeVietnameseTones = require("../utils/removeVietnameseTones");
const NodeCache = require("node-cache");
const geminiCache = new NodeCache({ stdTTL: 3600 }); // TTL 1h

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function getAvailableGeminiModel() {
  try {
    // Ưu tiên 2.5-flash (chưa dùng hết quota)
    const m = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    // Kiểm tra nhẹ bằng generateContent nhỏ
    await m.generateContent("ping");
    return m;
  } catch (err25) {
    console.warn("⚠️ gemini-2.0-flash failed, fallback to 2.5-flash");
    try {
      const m = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      await m.generateContent("ping");
      return m;
    } catch (err20) {
      console.error("❌ Cả 2 model đều lỗi:", err20.message);
      throw new Error("Cả 2 model đều lỗi hoặc hết quota");
    }
  }
}

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
      const roomClassId = detail.room_class_id.toString();
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
  const text = prompt.toLowerCase();

  const fullDateRegex = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/g;
  const shortDateRegex = /(\d{1,2})[\/\-](\d{1,2})/g;

  let matchDates = [...text.matchAll(fullDateRegex)];
  if (matchDates.length >= 1) {
    const [d1, m1, y1] = matchDates[0].slice(1);
    const [d2, m2, y2] = (matchDates[1] || matchDates[0]).slice(1);
    filters.check_in_date = `${d1.padStart(2, "0")}/${m1.padStart(
      2,
      "0"
    )}/${y1}`;
    filters.check_out_date = `${d2.padStart(2, "0")}/${m2.padStart(
      2,
      "0"
    )}/${y2}`;
    return filters;
  }

  // Nếu không có năm → giả định năm 2025
  matchDates = [...text.matchAll(shortDateRegex)];
  if (matchDates.length >= 1) {
    const [d1, m1] = matchDates[0].slice(1);
    const [d2, m2] = (matchDates[1] || matchDates[0]).slice(1);
    const year = "2025";
    filters.check_in_date = `${d1.padStart(2, "0")}/${m1.padStart(
      2,
      "0"
    )}/${year}`;
    filters.check_out_date = `${d2.padStart(2, "0")}/${m2.padStart(
      2,
      "0"
    )}/${year}`;
  }

  return filters;
}

async function sendMessageWithRetry(chat, prompt, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await chat.sendMessage(prompt);
      return result.response.text();
    } catch (err) {
      const isRetryable =
        err.message?.includes("503") ||
        err.message?.includes("429") ||
        err.response?.status === 429 ||
        err.response?.status === 503;

      if (i < retries - 1 && isRetryable) {
        console.warn(
          `⚠️ Gemini quá tải hoặc vượt hạn mức (lần ${
            i + 2
          }/${retries}), chờ ${delay}ms...`
        );
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error("❌ Không thể gửi message tới Gemini:", err.message);
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
    const allRooms = await getFilteredRooms(filters); // phòng còn trống theo ngày & số người

    const infoText = history
      .map((h) => h.parts?.map((p) => p.text || "").join(" "))
      .join(" ");
    const hasName = /tên[:\s]+[^\s]+/i.test(infoText);
    const hasEmail = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(
      infoText
    );
    const hasPhone = /((09|03|07|08|05)+([0-9]{8}))/i.test(infoText);
    const userInfoStatus =
      hasName && hasEmail && hasPhone ? "Đầy đủ" : "Thiếu thông tin";

    const confirmationPhrases = [
      "tôi xác nhận",
      "tôi đồng ý",
      "tôi muốn đặt",
      "xác nhận đặt phòng",
      "đặt phòng",
      "ok đặt luôn",
      "đặt luôn",
      "yes",
      "ok",
      "tôi muốn xác nhận",
    ];
    const lastUserInput =
      history
        .filter((h) => h.role === "user")
        .pop()
        ?.parts?.[0]?.text?.toLowerCase()
        .trim() || "";

    const normalizeText = (str) =>
      removeVietnameseTones(str).toLowerCase().trim();

    const isConfirmed = confirmationPhrases.some((phrase) =>
      normalizeText(lastUserInput).includes(normalizeText(phrase))
    );

    const nights = Math.ceil(
      (new Date(filters.check_out_date) - new Date(filters.check_in_date)) /
        (1000 * 60 * 60 * 24)
    );

    const systemPrompt = `
      Bạn là trợ lý AI của khách sạn The Moon Hotel, hỗ trợ khách đặt phòng qua hội thoại từng bước.

      🎯 MỤC TIÊU:
      1. Hỏi khách về yêu cầu đặt phòng: ngày check-in, check-out, số người lớn/trẻ em.
      2. Dựa trên danh sách phòng có sẵn (**không hiển thị toàn bộ**), chọn tối đa 2 loại phòng phù hợp nhất và gợi ý cho khách.
      3. Nếu khách muốn đặt, kiểm tra xem đã đủ thông tin cá nhân chưa:
        - Họ tên
        - Email
        - Số điện thoại
      4. Nếu thiếu thông tin, hãy lịch sự hỏi khách bổ sung.
      5. Khi đã có đủ thông tin, hỏi lại khách xác nhận lần cuối để tiến hành đặt phòng.

      🔒 QUY TẮC XÁC NHẬN:
      - **CHỈ xác nhận đặt phòng khi khách nói rõ** một trong các ý sau:
        "tôi xác nhận", "tôi muốn đặt", "xác nhận đặt phòng", "ok đặt luôn", "đặt luôn", "tôi muốn xác nhận", v.v.
      - **KHÔNG xác nhận** nếu khách chỉ hỏi thông tin như: 
        "còn loại nào khác?", "chọn phòng này được không?", "có phòng nào phù hợp không?", v.v.

      📅 ĐỊNH DẠNG NGÀY:
      - Luôn dùng định dạng ngày **dd/mm/yyyy** hoặc **d/m/yyyy**
      - KHÔNG dùng định dạng thiếu năm (ví dụ: "5/7" hoặc "07-10")

      ---

      📍 Tình trạng hiện tại:
      - ✅ Danh sách phòng đã lọc theo ngày & còn trống (**không hiển thị ra ngoài**)
      - ✅ Thông tin cá nhân: ${userInfoStatus}
      - ✅ Xác nhận đặt phòng: ${isConfirmed ? "Đã xác nhận" : "Chưa xác nhận"}

      📌 Danh sách phòng (để AI chọn, KHÔNG hiển thị lên chat):
      ${allRooms
        .map(
          (r) =>
            `ID: ${r._id} | Name: ${r.name} | Price: ${r.price} | Capacity: ${r.capacity} | View: ${r.view}`
        )
        .join("\n")}

      ---

      💡 Trả về kết quả dưới dạng tự nhiên, dễ hiểu, sau đó luôn đính kèm JSON bên dưới:

      \`\`\`json
      {
        "suggested_room_ids": ["id1", "id2"],
        "booking": {
          "full_name": "Tên khách",
          "email": "Email",
          "phone_number": "SĐT",
          "check_in_date": "${filters.check_in_date}",
          "check_out_date": "${filters.check_out_date}",
          "adult_amount": ${filters.adult_amount || 2},
          "child_amount": ${filters.child_amount || 0},
          "original_price": 0,
          "total_price": 0,
          "booking_details": [
            {
              "room_class_id": "ID đã chọn",
              "price_per_night": 0,
              "nights": ${nights},
              "services": []
            }
          ]
        }
      }
      \`\`\`

      🚫 Nếu khách chưa xác nhận rõ ràng, chỉ cần gợi ý phòng và KHÔNG tạo phần "booking".
    `;

    const cacheKey = `gemini:${prompt}:${JSON.stringify(history.slice(-5))}`;
    const cached = geminiCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const validHistory = sanitizeHistory(history).slice(-9);
    const model = await getAvailableGeminiModel(); // 👈 gọi model phù hợp
    const chat = model.startChat({ history: validHistory });

    const aiText = await sendMessageWithRetry(chat, systemPrompt);

    const updatedHistory = [
      ...validHistory,
      { role: "user", parts: [{ text: prompt }] },
      { role: "model", parts: [{ text: aiText }] },
    ];

    // Tách JSON
    const jsonMatch = aiText.match(/```json\s*([\s\S]*?)```/);
    let bookingData = null;
    let suggestedRoomIds = [];
    // console.log(jsonMatch)

    if (jsonMatch && jsonMatch[1]) {
      try {
        const jsonStr = jsonMatch[1].trim();
        const parsed = JSON.parse(jsonStr);
        bookingData = parsed.booking || null;
        suggestedRoomIds = Array.isArray(parsed.suggested_room_ids)
          ? parsed.suggested_room_ids
          : [];
      } catch (err) {
        console.warn("❌ Không parse được booking JSON:", err.message);
      }
    }

    const suggestedRooms = await RoomClass.find({
      _id: { $in: suggestedRoomIds },
    });

    const cleanedAiText = aiText.replace(/```json[\s\S]*?```/, "").trim();
    const isBookingConfirmed =
      !!bookingData?.full_name && !!bookingData?.booking_details?.length;

    const resultData = {
      response: cleanedAiText,
      history: updatedHistory,
      rooms: suggestedRooms,
      isBooking: isBookingConfirmed,
      bookingData,
    };
    geminiCache.set(cacheKey, resultData);
    return res.json(resultData);
  } catch (err) {
    console.error("❌ generateResponseWithDB Error:", err);
    return res.status(500).json({
      response: "Đã có lỗi xảy ra.",
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
    // 4. Kiểm tra cache
    const cacheKey = `gemini:suggestions:${keywords.join(",")}`;
    const cached = geminiCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }
    // 5. Gửi prompt tới Gemini
    const model = await getAvailableGeminiModel();
    const result = await model.generateContent(prompt);
    const text = result.response.text(); // nhanh hơn sendMessage

    // 6. Lưu cache kết quả
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
    // 8. Lưu cache kết quả
    const resultData = {
      roomClasses: fullRoomClasses,
      rawResponse: text,
    };
    geminiCache.set(cacheKey, resultData);
    // 9. Trả kết quả
    return res.json(resultData);
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
