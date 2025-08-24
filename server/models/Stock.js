const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  minStockAlert: {
    type: Number,
    default: 10, // default minimum stock alert
    min: 0,
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

// Update `updatedAt` automatically before save
stockSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Update `updatedAt` automatically on update
stockSchema.pre("findOneAndUpdate", function (next) {
  this._update.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Stock", stockSchema);
