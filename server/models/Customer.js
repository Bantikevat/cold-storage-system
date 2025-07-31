// models/Customer.js
const mongoose = require('mongoose');
// models/Customer.js


const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { 
    type: String, 
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v); // 10-digit phone number validation
      },
      message: 'कृपया 10 अंकों का वैध फोन नंबर डालें'
    }
  },
  email: { 
    type: String, 
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Email validation
      },
      message: 'कृपया एक वैध ईमेल पता डालें'
    }
  },
  address: { type: String, required: true },
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

module.exports = mongoose.model('Customer', customerSchema);
