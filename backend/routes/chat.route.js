const {
  generateResponseWithDB,
  fetchSuggestionsFromGemini,
} = require("../helpers/gemini");
const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");

// === TẠO MỚI ĐOẠN TRÒ CHUYỆN === //
router.post("/generate-response", generateResponseWithDB);

// === LẤY GỢI Ý TỪ GEMINI === //
router.get(
  "/suggestion",
  authMiddleware.verifyToken,
  fetchSuggestionsFromGemini
);

module.exports = router;
