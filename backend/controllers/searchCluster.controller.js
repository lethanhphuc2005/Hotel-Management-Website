const SearchCluster = require("../models/searchCluster.model");

// GET /api/search-cluster
const getSearchClusters = async (req, res) => {
  try {
    const clusters = await SearchCluster.find().sort({ cluster_id: 1 });
    res.json({ success: true, data: clusters });
  } catch (err) {
    console.error("getSearchClusters:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getSearchClusters,
};
