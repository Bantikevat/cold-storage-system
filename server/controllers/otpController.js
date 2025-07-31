const transporter = require('../utils/mailer');

let currentOtp = null;

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  currentOtp = otp;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: '✅ Your Active OTP Code for ColdStorePro',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #2c3e50;">🔐 ColdStorePro OTP Verification</h2>
          <p style="font-size: 16px;">Hello,</p>
          <p style="font-size: 16px;">Your <strong>One-Time Password (OTP)</strong> is:</p>
          <h1 style="color: #27ae60; font-size: 36px;">${otp}</h1>
          <p>This OTP is <b>active</b> and valid for <b>5 minutes</b>.</p>
          <br/>
          <p style="color: #999;">If you did not request this, please ignore this email.</p>
        </div>
      `
    });

    console.log(`✅ OTP sent to: ${email} - ${otp}`);
    res.status(200).json({ message: 'OTP sent successfully', otp }); // 🔁 (You can remove `otp` from response in production)
  } catch (error) {
    console.error(`❌ OTP Send Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to send OTP', message: error.message });
  }
};

exports.verifyOTP = (req, res) => {
  const { otp } = req.body;

  if (parseInt(otp) === currentOtp) {
    res.status(200).json({ verified: true, message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ verified: false, message: 'Invalid OTP' });
  }
};
