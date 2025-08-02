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
const dayjs = require("dayjs");
const { BookingStatus } = require("../models/status.model");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function getAvailableGeminiModel() {
  try {
    // Ưu tiên 2.5-flash (chưa dùng hết quota)
    const m = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    // Kiểm tra nhẹ bằng generateContent nhỏ
    await m.generateContent("ping");
    return m;
  } catch (err25) {
    console.warn("⚠️ Gemini 2.5-flash-lite lỗi hoặc hết quota:", err25.message);
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
  const query = { status: true };

  let roomClasses = await RoomClass.find(query)
    .populate("main_room_class images features")
    .sort({ createdAt: -1 });
  if (check_in_date && check_out_date) {
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);

    const excludedStatuses = await BookingStatus.find({
      code: { $in: ["CANCELLED", "CHECKED_OUT"] },
    }).select("_id");

    const excludedStatusIds = excludedStatuses.map((s) => s._id);
    const bookings = await Booking.find({
      check_in_date: { $lt: checkOut },
      check_out_date: { $gt: checkIn },
      booking_status_id: {
        $nin: excludedStatusIds,
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

    filters.check_in_date = dayjs(`${y1}-${m1}-${d1}`, "YYYY-MM-DD").toDate();
    filters.check_out_date = dayjs(`${y2}-${m2}-${d2}`, "YYYY-MM-DD").toDate();
    return filters;
  }

  matchDates = [...text.matchAll(shortDateRegex)];
  if (matchDates.length >= 1) {
    const [d1, m1] = matchDates[0].slice(1);
    const [d2, m2] = (matchDates[1] || matchDates[0]).slice(1);
    const year = "2025";

    filters.check_in_date = dayjs(`${year}-${m1}-${d1}`, "YYYY-MM-DD").toDate();
    filters.check_out_date = dayjs(
      `${year}-${m2}-${d2}`,
      "YYYY-MM-DD"
    ).toDate();
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

function getLastValidFiltersFromHistory(history) {
  for (let i = history.length - 1; i >= 0; i--) {
    const text = history[i]?.parts?.[0]?.text || "";
    const filters = extractFiltersFromPrompt(text);
    if (
      filters.check_in_date &&
      filters.check_out_date &&
      filters.check_in_date instanceof Date &&
      !isNaN(filters.check_in_date.getTime()) &&
      filters.check_out_date instanceof Date &&
      !isNaN(filters.check_out_date.getTime())
    ) {
      return filters;
    }
  }
  return null;
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
    // ====== 1. Xử lý ngày, fallback mặc định ======
    const fallbackDates = {
      check_in_date: new Date(),
      check_out_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      adult_amount: 2,
      child_amount: 0,
    };

    const extracted = extractFiltersFromPrompt(prompt);
    const hasValidNewDates =
      extracted.check_in_date instanceof Date &&
      !isNaN(extracted.check_in_date) &&
      extracted.check_out_date instanceof Date &&
      !isNaN(extracted.check_out_date);

    let filters = hasValidNewDates
      ? extracted
      : getLastValidFiltersFromHistory(history) || fallbackDates;

    // ====== 2. Lấy danh sách phòng phù hợp ======
    const allRooms = await getFilteredRooms(filters);

    // ====== 3. Kiểm tra thông tin cá nhân khách ======
    const combinedText = history
      .map((h) => h.parts?.map((p) => p.text || "").join(" "))
      .join(" ");
    const hasName = /tên[:\s]+[^\s]+/i.test(combinedText);
    const hasEmail = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(
      combinedText
    );
    const hasPhone = /((09|03|07|08|05)+([0-9]{8}))/i.test(combinedText);
    const userInfoStatus =
      hasName && hasEmail && hasPhone ? "Đầy đủ" : "Thiếu thông tin";

    // ====== 4. Kiểm tra xác nhận đặt phòng ======
    const confirmPhrases = [
      "tôi xác nhận",
      "tôi muốn đặt",
      "xác nhận đặt phòng",
      "ok đặt luôn",
      "đặt luôn",
      "yes",
      "ok",
      "tôi đồng ý",
      "tôi muốn xác nhận",
    ];
    const lastInput =
      history
        .filter((h) => h.role === "user")
        .pop()
        ?.parts?.[0]?.text?.toLowerCase() || "";
    const normalize = (s) => removeVietnameseTones(s).toLowerCase().trim();
    const isConfirmed = confirmPhrases.some((p) =>
      normalize(lastInput).includes(normalize(p))
    );

    const nights = Math.ceil(
      (new Date(filters.check_out_date) - new Date(filters.check_in_date)) /
        (1000 * 60 * 60 * 24)
    );
    // ====== 5. Prompt hệ thống (cho Gemini) ======
    const systemPrompt = `
  Bạn là trợ lý AI của khách sạn The Moon Hotel, hỗ trợ khách đặt phòng qua hội thoại từng bước.

  🎯 MỤC TIÊU:
  1. Hỏi khách về yêu cầu đặt phòng: ngày check-in, check-out, số người lớn/trẻ em.
  2. Dựa trên danh sách phòng có sẵn (**không hiển thị toàn bộ**):
    - Lọc phòng theo ngày check-in/check-out và số lượng người dựa trên capacity.
    - Gợi ý tối đa 3 loại phòng phù hợp với yêu cầu.
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

  📍 Tình trạng hiện tại:
  - ✅ Danh sách phòng đã lọc theo ngày & còn trống (**không hiển thị ra ngoài**)
  - ✅ Thông tin cá nhân: ${userInfoStatus}
  - ✅ Xác nhận đặt phòng: ${isConfirmed ? "Đã xác nhận" : "Chưa xác nhận"}

  📌 Danh sách phòng (chỉ để AI chọn, KHÔNG hiển thị lên chat):
  ${JSON.stringify(
    allRooms.map((r) => ({
      room_class_id: r.id,
      name: r.name,
      price: r.price_discount > 0 ? r.price_discount : r.price,
      bed_amount: r.bed.quantity,
      bed_type: r.bed.type,
      capacity: r.capacity,
      view: r.view,
      images: r.images.map((img) => img.url),
      features: r.features.map((f) => f.feature.name),
    })),
    null,
    2
  )}

  💡 LUẬT CHỌN PHÒNG:
  - Nếu khách **chỉ mô tả nhu cầu** (ví dụ: "tôi đi 4 người", "muốn phòng view biển"), gợi ý tối đa 3 phòng phù hợp nhất.
  - Nếu khách **chỉ rõ tên hoặc ID của 1 hay nhiều phòng cụ thể** (ví dụ: "tôi chọn phòng Deluxe và Family View"), thì **chỉ dùng các phòng đó**, KHÔNG gợi ý thêm.
  - Nếu chọn nhiều phòng, đảm bảo mỗi phòng có trong booking_details.

  🧠 LUẬT TỰ ĐỘNG PHÁT HIỆN NHIỀU PHÒNG:
  - Nếu khách dùng từ như: **"và", "cả 2", "2 phòng", "phòng số 1 và số 3", "Deluxe & Superior"**, hiểu là chọn nhiều phòng.

  🧾 PHẢN HỒI:
  - Trình bày câu trả lời tự nhiên, ngắn gọn, lịch sự.
  - Sau phần hội thoại, luôn trả về dữ liệu JSON bên dưới:

\`\`\`json
{
  "suggested_room_ids": ["ID1", "ID2", "ID3"], // Nếu chỉ gợi ý
  "booking": null, // Mặc định null

  // Nếu khách xác nhận đặt phòng rõ ràng thì mới tạo object booking:
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
        "room_class_id": "ID phòng 1",
        "price_per_night": 0,
        "nights": ${nights},
        "services": [],
        "room_class": {
          "name": "Tên loại phòng",
          "bed": {
            "type": "Loại giường",
            "quantity": 1
          },
          "capacity": 2,
          "description": "Mô tả loại phòng",
          "images": ["URL ảnh 1", "URL ảnh 2"],
          "features": ["Tiện nghi 1", "Tiện nghi 2"]
        }
      },
      {
        "room_class_id": "ID phòng 2",
        "price_per_night": 0,
        "nights": ${nights},
        "services": [],
        "room_class": { ... } // Thông tin phòng thứ 2
      }
    ]
  }
}
\`\`\`

🚫 Không tạo phần "booking" nếu khách chưa xác nhận rõ ràng.
`;

    // ====== 6. Tránh cache nếu prompt khác nhiều (có thể disable hoàn toàn nếu cần) ======
    const cacheKey = `gemini:${JSON.stringify(filters)}:${JSON.stringify(
      history.slice(-5)
    )}`;
    const cached = geminiCache.get(cacheKey);
    if (cached && !prompt.toLowerCase().includes("khác") && !isConfirmed) {
      return res.json(cached);
    }

    // ====== 7. Gọi Gemini Chat & Xử lý phản hồi ======
    const validHistory = sanitizeHistory(history).slice(-19);
    const model = await getAvailableGeminiModel();
    const chat = model.startChat({ history: validHistory });

    const aiText = await sendMessageWithRetry(chat, systemPrompt);

    const updatedHistory = [
      ...validHistory,
      { role: "user", parts: [{ text: prompt }] },
      { role: "model", parts: [{ text: aiText }] },
    ];

    const jsonMatch = aiText.match(/```json\s*([\s\S]*?)```/);
    let bookingData = null;
    let suggestedRoomIds = [];

    if (jsonMatch?.[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1].trim());
        bookingData = parsed.booking || null;
        suggestedRoomIds = Array.isArray(parsed.suggested_room_ids)
          ? parsed.suggested_room_ids
          : [];
      } catch (err) {
        console.warn("❌ JSON parse error:", err.message);
      }
    }

    const suggestedRooms = await RoomClass.find({
      _id: { $in: suggestedRoomIds },
    })
      .populate("main_room_class images features")
      .sort({ createdAt: -1 });

    const cleanedText = aiText.replace(/```json[\s\S]*?```/, "").trim();
    const isBookingConfirmed =
      !!bookingData?.full_name && !!bookingData?.booking_details?.length;

    const result = {
      response: cleanedText,
      history: updatedHistory,
      rooms: suggestedRooms,
      isBooking: isBookingConfirmed,
      bookingData,
    };
    geminiCache.set(cacheKey, result);
    return res.json(result);
  } catch (err) {
    console.error("❌ generateResponseWithDB error:", err);
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
    if (!userId) return res.status(401).json({ error: "Bạn chưa đăng nhập" });

    // 1. Lấy lịch sử tìm kiếm gần nhất
    const logs = await SearchLog.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(30);
    const keywords = [...new Set(logs.map((log) => log.normalized_keyword))];
    if (keywords.length === 0)
      return res.status(200).json({ message: "Không có từ khóa để gợi ý." });

    // 2. Lấy danh sách phòng
    const rooms = await RoomClass.find({ status: true }).select(
      "name description"
    );
    const roomNames = rooms.map((room) => `${room.name} - ${room.description}`);

    // 3. Tạo prompt
    const prompt = `
      Dưới đây là danh sách từ khóa người dùng đã tìm kiếm gần đây:
      ${keywords.map((kw, i) => `${i + 1}. ${kw}`).join("\n")}

      Dữ liệu hiện có (tên + mô tả phòng):
      ${roomNames.map((r) => `- ${r}`).join("\n")}

      Yêu cầu:
      - Phân tích từ khóa và gợi ý ít nhất 3 loại phòng phù hợp sở thích người dùng.
      - Chỉ trả về dưới dạng JSON THUẦN, không giải thích, không markdown.
      - Định dạng chính xác như sau:

      {
        "rooms": ["Tên phòng 1", "Tên phòng 2", "Tên phòng 3"]
      }
      `;

    // 4. Kiểm tra cache
    const cacheKey = `gemini:suggestions:${keywords.join(",")}`;
    const cached = geminiCache.get(cacheKey);
    if (cached) return res.json(cached);

    // 5. Gọi Gemini model (2.0 hoặc 2.5)
    const model = await getAvailableGeminiModel(); // bạn đã có hàm này
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 6. Parse JSON từ phản hồi
    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      if (!jsonMatch) throw new Error("Phản hồi không chứa JSON.");
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      return res.status(500).json({
        error: "Không thể phân tích kết quả từ AI",
        rawResponse: text,
      });
    }

    // 7. Chuẩn hóa tên phòng
    const normalizedRooms = normalizeArray(parsed.rooms || []);
    const roomClasses = rooms.filter((room) => {
      const name = removeVietnameseTones(room.name).toLowerCase();
      const desc = removeVietnameseTones(room.description).toLowerCase();
      return normalizedRooms.some(
        (kw) => name.includes(kw) || desc.includes(kw)
      );
    });

    if (roomClasses.length === 0) {
      return res.status(200).json({
        roomClasses: [],
        rawResponse: text,
        message: "Không tìm thấy loại phòng phù hợp từ gợi ý AI.",
      });
    }

    // 8. Lấy chi tiết đầy đủ
    const fullRoomClasses = await RoomClass.find({
      _id: { $in: roomClasses.map((r) => r._id).filter(Boolean) },
    }).populate("main_room_class images features");

    // 9. Trả kết quả & cache
    const resultData = {
      roomClasses: fullRoomClasses,
      rawResponse: text,
    };
    geminiCache.set(cacheKey, resultData);
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
