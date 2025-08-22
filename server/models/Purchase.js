
const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  purchaseDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  coldStorage: {
    type: String,
    required: true,
    trim: true,
  },
  vehicleNo: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  lotNo: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  transport: {
    type: String,
    required: true,
    trim: true,
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  variety: {
    type: String,
    required: true,
    trim: true,
  },
  quality: {
    type: String,
    enum: ['A', 'B', 'C', 'Premium', 'Standard', 'Other'],
    default: 'Other',
    required: true,
  },
  bags: {
    type: Number,
    required: true,
    min: 1,
  },
  weightPerBag: {
    type: Number,
    required: true,
    min: 0.01,
  },
  totalWeight: {
    type: Number,
    required: true,
    min: 0,
  },
  ratePerKg: {
    type: Number,
    required: true,
    min: 0,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  remarks: {
    type: String,
    trim: true,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

purchaseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

purchaseSchema.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Purchase', purchaseSchema);
