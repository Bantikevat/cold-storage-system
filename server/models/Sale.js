// models/Sale.js
const mongoose = require('mongoose');


const saleSchema = new mongoose.Schema({
 
  // ✅ Your Sale schema
clientId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Customer',
  required: true
},

 customerName: {
  type: String,
  required: false
},
  product: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  saleDate: {
    type: Date,
    default: Date.now
  },
  remarks: String
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});


module.exports = mongoose.model('Sale', saleSchema);
