const nodemailer = require('nodemailer');

console.log("📧 Email:", process.env.GMAIL_USER); // ✅ Check output in terminal
console.log("🔐 Pass:", process.env.GMAIL_PASS);  // ✅ Check output in terminal

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

module.exports = transporter;
