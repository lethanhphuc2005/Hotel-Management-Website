const {
  generateResponseWithDB,
  fetchSuggestionsFromGemini,
} = require("../helpers/gemini");
const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
const geminiRateLimiter = require("../middlewares/rateLimiter.middleware").geminiRateLimiter;

// === TẠO MỚI ĐOẠN TRÒ CHUYỆN === //
router.post(
  "/generate-response",
  authMiddleware.optionalVerifyToken,
  geminiRateLimiter, // Giới hạn tần suất truy cập
  generateResponseWithDB
);

// === LẤY GỢI Ý TỪ GEMINI === //
router.get(
  "/suggestion",
  authMiddleware.verifyToken,
  fetchSuggestionsFromGemini
);

module.exports = router;
