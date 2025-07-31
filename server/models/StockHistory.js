const mongoose = require('mongoose');

const stockHistorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  type: { type: String, enum: ['in', 'out'], required: true },
  quantity: { type: Number, required: true },
  remarks: { type: String, default: '' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StockHistory', stockHistorySchema);
