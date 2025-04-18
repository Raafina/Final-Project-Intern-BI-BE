const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SMTP_SERVICE_NAME,
  host: process.env.EMAIL_SMTP_HOST,
  port: process.env.EMAIL_SMTP_PORT,
  secure: process.env.EMAIL_SMTP_SECURE,
  auth: {
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PASS,
  },
  requireTLS: true,
});

// send email function
exports.sendMail = async ({ ...mailParams }) => {
  const result = await transporter.sendMail({
    ...mailParams,
  });
  return result;
};

exports.renderMailHtml = async (template, data) => {
  const content = await ejs.renderFile(
    path.join(__dirname, "templates", `${template}`),
    data
  );
  return content;
};
