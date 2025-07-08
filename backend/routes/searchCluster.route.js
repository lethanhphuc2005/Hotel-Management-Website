const express = require("express");
const router = express.Router();
const {
  getSearchClusters,
} = require("../controllers/searchCluster.controller");

router.get("/", getSearchClusters);

module.exports = router;
