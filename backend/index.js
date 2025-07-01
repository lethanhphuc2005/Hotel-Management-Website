const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const roomRouter = require("./routes/room.route");
const authRouter = require("./routes/auth.route");
const mainRoomClassRouter = require("./routes/mainRoomClass.route");
const roomClassRouter = require("./routes/roomClass.route");
const accountRouter = require("./routes/account.route");
const userRouter = require("./routes/user.route");
const websiteContentRouter = require("./routes/websiteContent.route");
const serviceRouter = require("./routes/service.route");
const imgroomtypeRouter = require("./routes/image.route");
const roomStatusRouter = require("./routes/roomStatus.route");
const bookingStatusRouter = require("./routes/bookingStatus.route");
const employeeRouter = require("./routes/employee.route");
const discountRouter = require("./routes/discount.route");
const contentTypeRouter = require("./routes/contentType.route");
const featureRouter = require("./routes/feature.route");
const bookingMethodRouter = require("./routes/bookingMethod.route");
const paymentMethodRouter = require("./routes/paymentMethod.route");
const bookingRouter = require("./routes/booking.route");
const commentRouter = require("./routes/comment.route");
const reviewRouter = require("./routes/review.route");
const paymentRouter = require("./routes/payment.route");
const chatRouter = require("./routes/chat.route");
const userFavoriteRouter = require("./routes/userFavorite.route");
const walletRouter = require("./routes/wallet.route");

dotenv.config();

const app = express();
const path = require("path");
require("./swagger")(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => {
    console.log("✅ Kết nối MongoDB thành công");
  })
  .catch((error) => {
    console.error("Lỗi kết nối MongoDB:", error);
  });

// Router
app.use("/v1/auth", authRouter);
app.use("/v1/room", roomRouter);
app.use("/v1/main-room-class", mainRoomClassRouter);
app.use("/v1/room-class", roomClassRouter);
app.use("/v1/user", userRouter);
app.use("/v1/account", accountRouter);
app.use("/v1/website-content", websiteContentRouter);
app.use("/v1/service", serviceRouter);
app.use("/v1/image", imgroomtypeRouter);
app.use("/v1/room-status", roomStatusRouter);
app.use("/v1/booking-status", bookingStatusRouter);
app.use("/v1/employee", employeeRouter);
app.use("/v1/discount", discountRouter);
app.use("/v1/content-type", contentTypeRouter);
app.use("/v1/feature", featureRouter);
app.use("/v1/booking-method", bookingMethodRouter);
app.use("/v1/payment-method", paymentMethodRouter);
app.use("/v1/booking", bookingRouter);
app.use("/v1/comment", commentRouter);
app.use("/v1/review", reviewRouter);
app.use("/v1/payment", paymentRouter);
app.use("/v1/chat", chatRouter);
app.use("/v1/user-favorite", userFavoriteRouter);
app.use("/v1/wallet", walletRouter);

app.listen(8000, () => {
  console.log("🚀 Server is running on port 8000");
});
