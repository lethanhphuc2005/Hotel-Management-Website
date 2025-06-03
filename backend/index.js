const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const roomRouter = require("./routes/room");
const authRouter = require("./routes/auth");
const roomTypeMainRouter = require("./routes/roomTypeMain");
const roomTypeRouter = require("./routes/roomType");
const accountRouter = require("./routes/account");
const userRouter = require("./routes/user");
const websiteContentRouter = require("./routes/websiteContent");
const serviceRouter = require("./routes/service");
const imgroomtypeRouter = require("./routes/image");
const statusRouter = require("./routes/status");
const employerRouter = require("./routes/employer");
const discountRouter = require("./routes/discount");
const contentTypeRouter = require("./routes/contentType");
const amenityRouter = require("./routes/amenity");

dotenv.config();

const app = express();
const path = require("path");
require('./swagger')(app);

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
app.use("/v1/room-type-main", roomTypeMainRouter);
app.use("/v1/room-type", roomTypeRouter);
app.use("/v1/user", userRouter);
app.use("/v1/account", accountRouter);
app.use("/v1/website-content", websiteContentRouter);
app.use("/v1/service", serviceRouter);
app.use("/v1/image", imgroomtypeRouter);
app.use("/v1/status", statusRouter);
app.use("/v1/employer", employerRouter);
app.use("/v1/discount", discountRouter);
app.use("/v1/content-type", contentTypeRouter);
app.use("/v1/amenity", amenityRouter);

app.listen(8000, () => {
  console.log("server đang chạy");
});
