const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  general: {
    companyName: { type: String, default: "My Stock App" },
    timezone: { type: String, default: "Asia/Kolkata" },
    currency: { type: String, default: "INR" },
    dateFormat: { type: String, default: "DD/MM/YYYY" }
  },
  security: {
    twoFactorAuth: { type: Boolean, default: false },
    passwordExpiry: { type: Number, default: 90 },
    loginAttempts: { type: Number, default: 5 }
  },
  notifications: {
    stockAlerts: { type: Boolean, default: true },
    emailReports: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: false }
  },
  payment: {
    paymentMethod: { type: String, default: "razorpay" },
    taxRate: { type: Number, default: 18 },
    invoicePrefix: { type: String, default: "INV-" }
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
