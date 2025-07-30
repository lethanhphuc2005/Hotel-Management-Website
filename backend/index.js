const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");
;
require("./cron/clusterKeywordCron");

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch((error) => console.error("❌ Lỗi kết nối MongoDB:", error));

// Router map
const routers = [
  { path: "/auth", module: require("./routes/auth.route") },
  { path: "/room", module: require("./routes/room.route") },
  { path: "/main-room-class", module: require("./routes/mainRoomClass.route") },
  { path: "/room-class", module: require("./routes/roomClass.route") },
  { path: "/user", module: require("./routes/user.route") },
  { path: "/account", module: require("./routes/account.route") },
  {
    path: "/website-content",
    module: require("./routes/websiteContent.route"),
  },
  { path: "/service", module: require("./routes/service.route") },
  { path: "/image", module: require("./routes/image.route") },
  { path: "/room-status", module: require("./routes/roomStatus.route") },
  { path: "/booking-status", module: require("./routes/bookingStatus.route") },
  { path: "/employee", module: require("./routes/employee.route") },
  { path: "/discount", module: require("./routes/discount.route") },
  { path: "/content-type", module: require("./routes/contentType.route") },
  { path: "/feature", module: require("./routes/feature.route") },
  { path: "/booking-method", module: require("./routes/bookingMethod.route") },
  { path: "/payment-method", module: require("./routes/paymentMethod.route") },
  { path: "/booking", module: require("./routes/booking.route") },
  { path: "/comment", module: require("./routes/comment.route") },
  { path: "/review", module: require("./routes/review.route") },
  { path: "/payment", module: require("./routes/payment.route") },
  { path: "/chat", module: require("./routes/chat.route") },
  { path: "/user-favorite", module: require("./routes/userFavorite.route") },
  { path: "/wallet", module: require("./routes/wallet.route") },
  { path: "/suggestion", module: require("./routes/suggestion.route") },
  { path: "/search-log", module: require("./routes/searchLog.route") },
  { path: "/search-cluster", module: require("./routes/searchCluster.route") },
  { path: "/test", module: require("./routes/test.route") },
];

// Apply all routers with prefix /api/v1
routers.forEach((r) => {
  app.use(`/api/v1${r.path}`, r.module);
});

// Start server
app.listen(8000, () => {
  console.log("🚀 Server is running at http://localhost:8000");
});
