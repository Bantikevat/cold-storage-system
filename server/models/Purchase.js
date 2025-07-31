// MultipleFiles/models/Purchase.js
const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer', // Reference to the Farmer model
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  variety: { // e.g., Kufri Jyoti, Chipsoma
    type: String,
    required: true,
    trim: true,
  },
  bags: { // Number of bags
    type: Number,
    required: true,
    min: 1,
  },
  weightPerBag: { // Weight per bag in KG
    type: Number,
    required: true,
    min: 0.01,
  },
  totalWeight: { // Calculated: bags * weightPerBag
    type: Number,
    required: true,
    min: 0,
  },
  ratePerKg: { // Rate per KG in INR
    type: Number,
    required: true,
    min: 0,
  },
  amount: { // Calculated: totalWeight * ratePerKg
    type: Number,
    required: true,
    min: 0,
  },
  quality: { // e.g., A, B, C
    type: String,
    enum: ['A', 'B', 'C', 'Other'], // Predefined qualities
    default: 'Other',
  },
  remarks: {
    type: String,
    trim: true,
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

// Update updatedAt field on save
purchaseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

purchaseSchema.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Purchase', purchaseSchema);
