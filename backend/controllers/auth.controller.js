const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../helpers/mail.sender");
const { verificationEmail } = require("../config/mail");



// XÁC MINH OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

  if ((user.verification_code || "").trim() !== (otp || "").trim()) {
  return res.status(400).json({ message: "OTP không hợp lệ" });
}

    user.is_verified = true;
    user.verification_code = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id }, // ✅ Chỉ truyền id
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Xác minh OTP thành công", token });
  } catch (err) {
    console.error("❌ Lỗi xác minh OTP:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
// GỬI LẠI OTP
exports.resendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email là bắt buộc" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verification_code = otp;
    await user.save();

    console.log("🔁 Gửi lại OTP cho:", email);
    console.log("OTP mới:", otp);
    console.log("Thời gian:", new Date());

    res.status(200).json({ message: "Đã gửi lại OTP thành công" });
  } catch (err) {
    console.error("❌ Lỗi gửi lại OTP:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
exports.resendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email là bắt buộc" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    if (user.is_verified) {
      return res.status(400).json({ message: "Tài khoản đã được xác minh." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verification_code = otp;
    await user.save();

    // Gửi email
    try {
      await mailSender({
        email: user.email,
        subject: verificationEmail.subject,
        html: verificationEmail.html(otp),
      });
    } catch (mailError) {
      return res.status(500).json({
        message: "Gửi email thất bại",
        error: mailError.message,
      });
    }

    console.log("🔁 Gửi lại OTP:", otp, "cho:", email, "lúc:", new Date());
    res.status(200).json({ message: "Đã gửi lại OTP thành công" });
  } catch (err) {
    console.error("❌ Lỗi gửi lại OTP:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
}
// GỬI OTP ĐỂ ĐẶT LẠI MẬT KHẨU
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email là bắt buộc" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verification_code = otp;
    await user.save();

    // Gửi email
    try {
      await mailSender({
        email: user.email,
        subject: "Khôi phục mật khẩu",
        html: `<h3>Mã OTP khôi phục mật khẩu:</h3><p style="font-size: 20px;"><b>${otp}</b></p>`,
      });
    } catch (mailError) {
      return res.status(500).json({ message: "Gửi email thất bại", error: mailError.message });
    }

    console.log("📩 Gửi OTP reset pass:", otp, "cho:", email, "lúc:", new Date());
    res.status(200).json({ message: "Đã gửi mã OTP đến email" });
  } catch (err) {
    console.error("❌ Lỗi forgotPassword:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
exports.verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    if ((user.verification_code || "").trim() !== (otp || "").trim()) {
      return res.status(400).json({ message: "OTP không đúng" });
    }

    res.status(200).json({ message: "OTP chính xác, tiếp tục đặt lại mật khẩu" });
  } catch (err) {
    console.error("❌ Lỗi verifyResetOtp:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword)
    return res.status(400).json({ message: "Thiếu email hoặc mật khẩu mới" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.verification_code = null; // clear mã
    await user.save();

    res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
  } catch (err) {
    console.error("❌ Lỗi resetPassword:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
