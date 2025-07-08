const router = require("express").Router();
const suggestController = require("../controllers/suggestion.controller");

router.get("/", suggestController.getSuggestions);

router.get("/keyword", suggestController.getSuggestionsByKeyword);

module.exports = router;
