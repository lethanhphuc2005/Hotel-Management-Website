const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const roomRouter = require("./routes/room");
const roomtypeRouter = require("./routes/roomtype");
const accountRouter = require("./routes/account");
const userRouter = require("./routes/user");
const websiteContentRouter = require("./routes/websiteContent");
const serviceRouter = require("./routes/service");
const imgroomtypeRouter = require("./routes/imgRoomType");
const statusRouter = require("./routes/status");
const employerRouter = require("./routes/employer");
const discountRouter = require("./routes/discount");
const contentTypeRouter = require("./routes/contentType");

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
app.use("/v1/room", roomRouter);
app.use("/v1/roomtype", roomtypeRouter);
app.use("/v1/user", userRouter);
app.use("/v1/account", accountRouter);
app.use("/v1/websitecontent", websiteContentRouter);
app.use("/v1/service", serviceRouter);
app.use("/v1/imgroomtype", imgroomtypeRouter);
app.use("/v1/status", statusRouter);
app.use("/v1/employer", employerRouter);
app.use("/v1/discount", discountRouter);
app.use("/v1/contenttype", contentTypeRouter);

app.listen(8000, () => {
  console.log("server đang chạy");
});
