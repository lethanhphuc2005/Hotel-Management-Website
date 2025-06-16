const nodemailer = require("nodemailer");
const { mailConfig } = require("../config/mail");

const mailSender = ({ email, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: mailConfig.secure,
    auth: mailConfig.auth,
  });
  const mailOptions = {
    from: mailConfig.from, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
  };

  transporter.sendMail(mailOptions);
};

module.exports = mailSender;
