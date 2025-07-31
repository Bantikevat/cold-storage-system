const mongoose = require('mongoose');

const storageSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  storageDate: { type: Date, default: Date.now },
  outDate: { type: Date },               // ➕ New
  room: { type: String },                // ➕ New
  rate: { type: Number, default: 0 },    // ➕ New
  remarks: { type: String },
  room: { type: String },
  rate: { type: Number, default: 0 }

  
}, {
  timestamps: true
});

module.exports = mongoose.model('Storage', storageSchema);
