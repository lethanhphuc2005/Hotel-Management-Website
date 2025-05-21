const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let refreshTokens = [];
const accountCon = {
  creareToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "30s" }
    );
  },
  creareRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "20d" }
    );
  },
  // add
  addAccount: async (req, res) => {
    try {
       const checkAccount = await userModel.findOne({
        Email: req.body.email,
      });
      if (checkAccount) {
        return res.status(400).json("Email đã tồn tại");
      }
      // Mã hoá mật khẩu bằng bcrypt
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      // Tạo một instance mới của userModel
      const newAccount = new userModel({
        Email: req.body.email,
        MatKhau: hashPassword,
      });
      // Lưu vào database bằng hàm save()
      const savedAccount = await newAccount.save();
      res.status(200).json(savedAccount);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  login: async (req, res) => {
    try {
      const checkUser = await userModel.findOne({ Email: req.body.email });
      if (!checkUser) {
        return res.status(400).json("sai email");
      }
      console.log(checkUser);
      console.log(req.body);
      // const validPassword = (await req.body.password) == user.Password;
      // console.log(validPassword);
      const isMatch = await bcrypt.compare(
        req.body.password,
        checkUser.MatKhau
      );
      if (!isMatch) {
        return res.status(400).json("sai password");
      }
      if (checkUser && isMatch) {
        const accessToken = accountCon.creareToken(checkUser);
        const refreshToken = accountCon.creareRefreshToken(checkUser);
        /*
        refreshTokens.push(refreshToken)
        console.log(refreshTokens);
        res.cookie("refreshToken", refreshToken,{
          httpOnly: true,
          secure:false,
          path: "/",
          sameSite:"strict"
        })
        */
        const { password, ...others } = checkUser._doc;
        res.status(200).json({ ...others, accessToken, refreshToken });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  requestRefreshToken: async (req, res) => {
    // Lấy refresh từ người dùng
    //const refreshToken = req.cookies.refreshToken;
    let { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json("Không có token");

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(403).json("Lỗi xác thực token");
      }

      // Xóa refreshToken cũ khỏi danh sách
      //refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      // Tạo accessToken và refreshToken mới
      const newAccessToken = accountCon.creareToken(user);
      const newRefreshToken = accountCon.creareRefreshToken(user);

      // Thêm refreshToken mới vào danh sách
      //refreshTokens.push(newRefreshToken);

      // Đặt cookie với refreshToken mới
      /*
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      */
      res
        .status(200)
        .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    });
  },
  logout: async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    res.status(200).json("đăng xuất thành công");
  },
};
module.exports = accountCon;
