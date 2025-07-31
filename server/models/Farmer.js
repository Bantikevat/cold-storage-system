// MultipleFiles/models/Farmer.js
const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true }, // Phone should be unique
  address: { type: String, trim: true },
  aadhaar: { type: String, unique: true, sparse: true, trim: true }, // Aadhaar should be unique, sparse allows null
  email: { type: String, unique: true, sparse: true, trim: true, lowercase: true }, // Email unique, sparse, lowercase
  // preferredRoom field removed as per request
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update 'updatedAt' field on save
farmerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Farmer', farmerSchema);
