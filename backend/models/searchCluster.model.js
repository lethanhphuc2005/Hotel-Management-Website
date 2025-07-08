const mongoose = require("mongoose");

const searchClusterSchema = new mongoose.Schema(
  {
    cluster_id: Number,
    keywords: [String],
    representative: String,
  },
  { timestamps: true }
);

const SearchCluster = mongoose.model(
  "search_cluster",
  searchClusterSchema,
  "search_cluster"
);
module.exports = SearchCluster;