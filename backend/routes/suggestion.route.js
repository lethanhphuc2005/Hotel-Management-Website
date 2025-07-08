const router = require("express").Router();
const suggestController = require("../controllers/suggestion.controller");

router.get("/", suggestController.getSuggestions);

module.exports = router;
