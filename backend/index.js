const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const phongRouter = require("./routes/phong");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Kết nối MongoDB
mongoose
    .connect(process.env.MONGOOSE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Kết nối thành công đến MongoDB");
    })
    .catch((error) => {
        console.error("Lỗi kết nối MongoDB:", error);
    });

// Router
app.use("/v1/phong", phongRouter);

app.listen(8000, () => {
    console.log("sevver đang chạy");
});