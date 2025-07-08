const express = require("express");
const router = express.Router();
const {
  saveSearchLog,
  getSearchHistory,
  getTrendingKeywords,
  getKeywordsForAI,
} = require("../controllers/searchLog.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/", authMiddleware.optionalVerifyToken, saveSearchLog); // POST /api/search-log
router.get("/history", authMiddleware.verifyToken, getSearchHistory); // GET /api/search-log/history
router.get("/trending", getTrendingKeywords); // GET /api/search-log/trending
router.get("/ai-keywords", getKeywordsForAI);

module.exports = router;
