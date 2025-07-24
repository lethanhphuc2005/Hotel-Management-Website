const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("./config/passport.config");
const cookieParser = require("cookie-parser");

const app = express();
require("./swagger")(app);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "super_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
const allowedOrigins = [
  process.env.FRONTEND_URL, // ví dụ: http://localhost:3000 (user)
  process.env.ADMIN_URL, // ví dụ: http://localhost:4000 (admin)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép nếu origin nằm trong danh sách, hoặc không có origin (cho Postman, SSR)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

module.exports = app;
