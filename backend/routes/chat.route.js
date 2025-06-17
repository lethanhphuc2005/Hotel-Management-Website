const { generateResponse, generateResponseWithDB } = require("../helpers/gemini");
const router = require("express").Router();


// === TẠO MỚI ĐOẠN TRÒ CHUYỆN === //
router.post("/generate-response", generateResponseWithDB
  
);

module.exports = router;