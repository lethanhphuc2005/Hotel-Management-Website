const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const roomRouter = require("./routes/room");
const authRouter = require("./routes/auth");
const mainRoomClassRouter = require("./routes/mainRoomClass");
const roomClassRouter = require("./routes/roomClass");
const accountRouter = require("./routes/account");
const userRouter = require("./routes/user");
const websiteContentRouter = require("./routes/websiteContent");
const serviceRouter = require("./routes/service");
const imgroomtypeRouter = require("./routes/image");
const roomStatusRouter = require("./routes/roomStatus");
const bookingStatusRouter = require("./routes/bookingStatus");
const employeeRouter = require("./routes/employee");
const discountRouter = require("./routes/discount");
const contentTypeRouter = require("./routes/contentType");
const featureRouter = require("./routes/feature");

dotenv.config();

const app = express();
const path = require("path");
require("./swagger")(app);

// Middleware
app.use(express.json());
app.use(cors());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => {
    console.log("✅ Kết nối thành công đến MongoDB");
  })
  .catch((error) => {
    console.error("Lỗi kết nối MongoDB:", error);
  });

// Router
app.use(express.static(path.join(__dirname, "public")));
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

app.listen(8000, () => {});
