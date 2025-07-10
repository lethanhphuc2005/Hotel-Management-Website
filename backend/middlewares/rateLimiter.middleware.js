// middlewares/rateLimiter.js
const rateLimit = require("express-rate-limit");

// Giới hạn: 10 request mỗi 60 giây
const geminiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 60 giây
  max: 10,             // Tối đa 10 request / window
  message: {
    error: "Bạn đã gửi quá nhiều yêu cầu đến Gemini. Vui lòng thử lại sau ít phút.",
  },
  keyGenerator: (req, res) => {
    // Ưu tiên lấy theo IP hoặc theo user nếu có đăng nhập
    return req.user?.id || req.ip;
  },
});

module.exports = {
  geminiRateLimiter,
  // Có thể thêm các rate limiter khác nếu cần
  // ví dụ: openaiRateLimiter, anthropicRateLimiter, etc.
  // openaiRateLimiter: rateLimit({ ... }),
  // anthropicRateLimiter: rateLimit({ ... }),
  // v.v.
};