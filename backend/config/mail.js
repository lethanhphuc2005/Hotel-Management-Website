require("dotenv").config();
const LOGO_URL =
  process.env.LOGO_URL ||
  "https://res.cloudinary.com/damtgpfqo/image/upload/v1749801601/logo-ngang_u8feyl.png"; // Thay bằng URL logo trắng
const COMPANY_NAME = process.env.COMPANY_NAME || "The Moon Hotel";

const FOOTER = `
  <hr style="margin: 10px 0; border-color: #444;" />
  <p style="font-size: 12px;">
    © ${new Date().getFullYear()} ${COMPANY_NAME}. Mọi quyền được bảo lưu.
  </p>
`;

module.exports = {
  mailConfig: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 465,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    from: `${COMPANY_NAME} <${process.env.SMTP_USER}>`,
  },

  verificationEmail: {
    subject: "Xác minh tài khoản The Moon Hotel",
    html: (verificationCode) => `
      <div style="font-family: Arial, sans-serif; background-color: #111; color: #eee; padding: 30px; max-width: 600px; margin: auto; border-radius: 8px;">
        <img src="${LOGO_URL}" alt="Logo" style="max-width: 150px; display: block; margin: 0 auto 20px;" />
        <h1 style="color: #fff; text-align: center;">Xác minh tài khoản của bạn</h1>
        <p style="text-align: center;">Vui lòng sử dụng mã dưới đây để xác minh:</p>
        <div style="text-align: center; font-size: 28px; font-weight: bold; margin: 20px auto; background-color: #222; padding: 15px; border-radius: 5px; color: #0f0; width: fit-content;">
          ${verificationCode}
        </div>
        <p style="text-align: center;">Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
        ${FOOTER}
      </div>
    `,
  },

  forgotPasswordEmail: {
    subject: "Mã đặt lại mật khẩu The Moon Hotel",
    html: (verificationCode) => `
      <div style="font-family: Arial, sans-serif; background-color: #111; padding: 30px; max-width: 600px; margin: auto; border-radius: 8px;">
        <img src="${LOGO_URL}" alt="Logo" style="max-width: 150px; display: block; margin: 0 auto 20px;" />
        <h1 style="color: #f39c12; text-align: center;">Đặt lại mật khẩu</h1>
        <p style="text-align: center; color: #eee;">Vui lòng sử dụng mã dưới đây để đặt lại mật khẩu của bạn:</p>
        <div style="text-align: center; font-size: 28px; font-weight: bold; margin: 20px auto; background-color: #222; padding: 15px; border-radius: 5px; color: #f1c40f; width: fit-content;">
          ${verificationCode}
        </div>
        <p style="text-align: center; color: #888;  ">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        ${FOOTER}
      </div>
    `,
  },

  notificationEmail: {
    subject: "Thông báo từ The Moon Hotel",
    html: (message) => `
      <div style="font-family: Arial, sans-serif; background-color: #111; color: #eee; padding: 30px; max-width: 600px; margin: auto; border-radius: 8px;">
        <img src="${LOGO_URL}" alt="Logo" style="max-width: 150px; display: block; margin: 0 auto 20px;" />
        <h1 style="color: #1abc9c; text-align: center;">Thông báo</h1>
        <p style="text-align: center;">${message}</p>
        <p style="text-align: center;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        ${FOOTER}
      </div>
    `,
  },
};
