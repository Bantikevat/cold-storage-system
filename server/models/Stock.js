const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: ' '
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0
  },
  minStockAlert: {    // ✅ Ye naam frontend ke naam ke same hona chahiye
    type: Number,
    required: true,
    default: 10
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);
