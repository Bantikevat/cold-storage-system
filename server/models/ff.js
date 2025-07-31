// models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },   // ✅
  email: { type: String, required: true },
  address: { type: String, required: true },
});
customerSchema.set('timestamps', true); // ✅ Add timestamps for createdAt and updatedAt

module.exports = mongoose.model('Customer', customerSchema);
// backend/models/Farmer.js
const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: String,
  aadhaar: String,
  email: String,
  preferredRoom: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Farmer', farmerSchema);
const mongoose = require('mongoose');
const PaymentSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
  amount: Number,
  date: Date,
  remarks: String
});
module.exports = mongoose.model('Payment', PaymentSchema);
// ✅ models/Purchase.js
const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  variety: {
    type: String,
    required: true
  },
  bags: {
    type: Number,
    required: true
  },
  weightPerBag: {
    type: Number,
    required: true
  },
  totalWeight: {
    type: Number,
    required: true
  },
  ratePerKg: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  quality: {
    type: String,
    enum: ['A', 'B', 'C'],
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  remarks: {
    type: String
  }
});


module.exports = mongoose.model('Purchase', purchaseSchema);
// models/Sale.js
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
 
  clientId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Customer'
},
  customerName: {
    type: String,
    required: true
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
});

module.exports = mongoose.model('Sale', saleSchema);
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
const dotenv = require('dotenv');
const farmerRoutes = require('./routes/farmerRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const salesRoutes = require('./routes/salesRoutes');
const customerRoutes = require('./routes/customerRoutes');
const storageRoutes = require('./routes/storageRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config(); // ✅ Sabse upar hona chahiye

const express = require('express');
const connectDB = require('./config/db');
const otpRoutes = require('./routes/otpRoutes');
const cors = require('cors');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/otp', otpRoutes);

app.use('/api/farmers', farmerRoutes);


app.use('/api/purchases', purchaseRoutes);


app.use('/api/sales', salesRoutes);


app.use('/api/customers', customerRoutes);

app.use('/api/storage', storageRoutes);


app.use('/api/payments', paymentRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


const Customer = require('../models/Customer');



exports.addCustomer = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;  // ✅ CORRECT
    const newCustomer = new Customer({ name, phone, email, address });
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(500).json({ message: "Error creating customer" });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch customers', error });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Error getting customer' });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating customer' });
  }
};
exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting customer' });
  }
};
// backend/controllers/farmerController.js
const Farmer = require('../models/Farmer');
// ✅ controllers/farmerController.js
const Storage = require('../models/Storage');
const Purchase = require('../models/Purchase');
const Payment = require('../models/Payment');


exports.addFarmer = async (req, res) => {
  try {
    const newFarmer = new Farmer(req.body);
    const savedFarmer = await newFarmer.save();
    res.status(201).json(savedFarmer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add farmer', message: error.message });
  }
};

exports.getAllFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find();
    res.status(200).json(farmers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch farmers', message: error.message });
  }
};
// backend/controllers/farmerController.js
exports.updateFarmer = async (req, res) => {
  try {
    const updated = await Farmer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update farmer', message: error.message });
  }
};

exports.deleteFarmer = async (req, res) => {
  try {
    await Farmer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Farmer deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete farmer', message: error.message });
  }
};

exports.getFarmerLedger = async (req, res) => {
  try {
    const farmerId = req.params.farmerId;

    if (!farmerId || farmerId === 'undefined') {
      return res.status(400).json({ message: "Invalid farmer ID" });
    }

    const storageEntries = await Storage.find({ farmerId });
    const purchases = await Purchase.find({ farmerId }).select('purchaseDate variety bags totalWeight amount');
    const payments = await Payment.find({ farmerId }).select('date amount remarks');

    const totalStorageRent = storageEntries.reduce((sum, s) => {
      const inDate = new Date(s.storageDate);
      const outDate = s.outDate ? new Date(s.outDate) : new Date();
      const days = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));
      const total = days * s.quantity * s.rate;
      return sum + total;
    }, 0);

    const totalPurchase = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const outstanding = (totalStorageRent + totalPurchase) - totalPaid;

    res.json({
      storageEntries,
      purchases,
      payments,
      summary: {
        totalStorageRent,
        totalPurchase,
        totalPaid,
        outstanding
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ledger fetch failed' });
  }
};
const transporter = require('../utils/mailer');

let currentOtp = null;

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  currentOtp = otp;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: '✅ Your Active OTP Code for ColdStorePro',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #2c3e50;">🔐 ColdStorePro OTP Verification</h2>
          <p style="font-size: 16px;">Hello,</p>
          <p style="font-size: 16px;">Your <strong>One-Time Password (OTP)</strong> is:</p>
          <h1 style="color: #27ae60; font-size: 36px;">${otp}</h1>
          <p>This OTP is <b>active</b> and valid for <b>5 minutes</b>.</p>
          <br/>
          <p style="color: #999;">If you did not request this, please ignore this email.</p>
        </div>
      `
    });

    console.log(`✅ OTP sent to: ${email} - ${otp}`);
    res.status(200).json({ message: 'OTP sent successfully', otp }); // 🔁 (You can remove `otp` from response in production)
  } catch (error) {
    console.error(`❌ OTP Send Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to send OTP', message: error.message });
  }
};

exports.verifyOTP = (req, res) => {
  const { otp } = req.body;

  if (parseInt(otp) === currentOtp) {
    res.status(200).json({ verified: true, message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ verified: false, message: 'Invalid OTP' });
  }
};
// ✅ controllers/purchaseController.js
const Purchase = require('../models/Purchase');
const mongoose = require('mongoose'); // ✅ यह missing था


exports.addPurchase = async (req, res) => {
  try {
    const {
      farmerId, variety, bags, weightPerBag,
      ratePerKg, quality, remarks, purchaseDate
    } = req.body;

    const totalWeight = Number(bags) * Number(weightPerBag);
    const amount = totalWeight * Number(ratePerKg);

    const newPurchase = new Purchase({
      farmerId,
      variety,
      bags,
      weightPerBag,
      totalWeight,
      ratePerKg,
      amount,
      quality,
      remarks,
      purchaseDate: purchaseDate || new Date()
    });

    const savedPurchase = await newPurchase.save();
    res.status(201).json(savedPurchase);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add purchase', message: error.message });
  }
};

// ✅ Final getAllPurchases with pagination
exports.getAllPurchases = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'date', order = 'desc' } = req.query;

    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    // 🟡 If sort by farmer name
    if (sortBy === 'farmer') {
      const purchases = await Purchase.aggregate([
        {
          $lookup: {
            from: 'farmers',
            localField: 'farmerId',
            foreignField: '_id',
            as: 'farmerData'
          }
        },
        { $unwind: '$farmerData' },
        { $sort: { 'farmerData.name': sortOrder } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
        {
          $project: {
            _id: 1,
            variety: 1,
            bags: 1,
            weightPerBag: 1,
            totalWeight: 1,
            ratePerKg: 1,
            amount: 1,
            quality: 1,
            remarks: 1,
            purchaseDate: 1,
            farmerId: {
              _id: '$farmerData._id',
              name: '$farmerData.name',
              phone: '$farmerData.phone'
            }
          }
        }
      ]);

      const total = await Purchase.countDocuments();
      return res.status(200).json({ purchases, total });
    }

    // 🟢 Sort by date or amount
    const sortOptions = {};
    if (sortBy === 'date') sortOptions.purchaseDate = sortOrder;
    if (sortBy === 'amount') sortOptions.amount = sortOrder;

    const purchases = await Purchase.find()
      .populate('farmerId', 'name phone')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Purchase.countDocuments();
    return res.status(200).json({ purchases, total });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchases', message: error.message });
  }
};



exports.getSinglePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id).populate('farmerId', 'name phone');
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchase', message: error.message });
  }
};

// ✅ Update Purchase
exports.updatePurchase = async (req, res) => {
  try {
    const updated = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

// ✅ Delete Purchase
exports.deletePurchase = async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};
// ✅ Add this function in purchaseController.js

exports.getPurchaseReport = async (req, res) => {
  try {
    const { fromDate, toDate, farmerId } = req.query;
    const filter = {};

    // 🟢 Date range logic
    const from = new Date(fromDate);
    from.setHours(0, 0, 0, 0);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);
    filter.purchaseDate = { $gte: from, $lte: to };

    // ✅ Strong validation for farmerId
    if (
      farmerId &&
      typeof farmerId === 'string' &&
      farmerId !== 'null' &&
      farmerId !== 'undefined' &&
      mongoose.Types.ObjectId.isValid(farmerId)
    ) {
      filter.farmerId = new mongoose.Types.ObjectId(farmerId);
    }

    // ✅ Populate farmerId with name
    const purchases = await Purchase.find(filter).populate('farmerId', 'name');

    // 🔍 Safety log
    console.log('Final Filter:', filter);
    console.log('Sample Purchase:', purchases[0]);

    res.status(200).json(purchases);
  } catch (error) {
    console.error('Report Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
// controllers/salesController.js
const Sale = require('../models/Sale');

// ✅ Add Sale
exports.addSale = async (req, res) => {
  try {
    const { customerName, product, quantity, rate, saleDate, remarks } = req.body;
    const amount = quantity * rate;

    const newSale = new Sale({ customerName, product, quantity, rate, amount, saleDate, remarks });
    const saved = await newSale.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to add sale", error: err.message });
  }
};

// ✅ Get All Sales
// ✅ Get All Sales with total count and pagination
exports.getAllSales = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'saleDate';
    const order = req.query.order === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const total = await Sale.countDocuments();
    const sales = await Sale.find()
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ sales, total });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sales", error: err.message });
  }
};


// ✅ Delete Sale
exports.deleteSale = async (req, res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

// ✅ Update Sale
exports.updateSale = async (req, res) => {
  try {
    const updated = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// ✅ Get Sales Report (with date filters)
// ✅ backend: controllers/salesController.js
// ✅ Improved backend: getSalesReport with filtering + populate
exports.getSalesReport = async (req, res) => {
  try {
    const { fromDate, toDate, customer } = req.query;
    const filter = {};

    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const toD = new Date(toDate);
      toD.setHours(23, 59, 59, 999);
      filter.saleDate = { $gte: from, $lte: toD };
    }

    if (customer) {
      filter.clientId = customer;
    }

    const sales = await Sale.find(filter).populate('clientId');
    res.status(200).json(sales);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch report', error: err.message });
  }
};


// ✅ Get Sale by ID (for invoice)
exports.getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.status(200).json(sale);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch sale', error: err.message });
  }
};
const Storage = require('../models/Storage');
const Farmer = require('../models/Farmer');


// Optional: Define capacity for each cold room
const ROOM_CAPACITY = {
  'Room-1': 5000,
  'Room-2': 8000,
  'Room-3': 10000,
};

exports.addStorage = async (req, res) => {
  try {
    const {
      farmerId,
      product,
      quantity,
      remarks,
      room,
      rate,
      outDate
    } = req.body;

    // 🔒 Validation (optional, you can expand)
    if (!farmerId || !product || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const qty = Number(quantity);
    const ratePerKg = Number(rate || 0);

    // ✅ Room Capacity Check
    if (room && ROOM_CAPACITY[room]) {
      const existingStorage = await Storage.find({
        room,
        outDate: { $exists: false } // Only currently stored items
      });

      const currentTotalQty = existingStorage.reduce((sum, entry) => sum + (entry.quantity || 0), 0);

      if ((currentTotalQty + qty) > ROOM_CAPACITY[room]) {
        return res.status(400).json({
          message: `❌ Room capacity exceeded! (Available: ${ROOM_CAPACITY[room] - currentTotalQty} kg)`
        });
      }
    }

    // ✅ Create new entry
    const newEntry = new Storage({
      farmerId,
      product,
      quantity: qty,
      remarks,
      room,
      rate: ratePerKg,
      outDate: outDate || null
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    console.error("Storage Add Error:", err);
    res.status(500).json({ message: "❌ Failed to add storage entry" });
  }
};

exports.getAllStorage = async (req, res) => {
  try {
    const entries = await Storage.find().populate('farmerId');
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ message: "Failed to get storage entries" });
  }
};

exports.getStorageById = async (req, res) => {
  try {
    const entry = await Storage.findById(req.params.id);
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch storage entry" });
  }
};

exports.updateStorage = async (req, res) => {
  try {
    const updated = await Storage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update storage" });
  }
};

exports.deleteStorage = async (req, res) => {
  try {
    await Storage.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const {
  addFarmer,
  getAllFarmers,
  updateFarmer,
  deleteFarmer,
  getFarmerLedger, // ✅ THIS LINE WAS MISSING
} = require('../controllers/farmerController');

router.post('/add', addFarmer);
router.get('/all', getAllFarmers);
router.put('/update/:id', updateFarmer);
router.delete('/delete/:id', deleteFarmer);

// ✅ Ledger route
router.get('/ledger/:farmerId', getFarmerLedger);



module.exports = router;
const express = require('express');
const { sendOTP, verifyOTP } = require('../controllers/otpController');
const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  addStorage,
  getAllStorage,
    getStorageById,
    updateStorage,
    deleteStorage
} = require('../controllers/storageController');

router.post('/add', addStorage);
router.get('/all', getAllStorage);

router.get('/:id', getStorageById);              // for Edit
router.put('/update/:id', updateStorage);        // for Edit
router.delete('/:id', deleteStorage);            // for Delete


module.exports = router;
// ✅ Updated Backend Route for Report

const express = require('express');
const router = express.Router();
const {
  addPurchase,
  getAllPurchases,
  getSinglePurchase,
  updatePurchase,
  deletePurchase,
  getPurchaseReport, // ✅ import this
} = require('../controllers/purchaseController');

// Existing routes
router.post('/', addPurchase);
router.get('/report', getPurchaseReport); // ✅ पहले
router.get('/all', getAllPurchases);
router.get('/:id', getSinglePurchase); // ✅ बाद में
router.put('/:id', updatePurchase);
router.delete('/:id', deletePurchase);




module.exports = router;
const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.post('/add', salesController.addSale);
router.get('/all', salesController.getAllSales);
router.get('/:id', salesController.getSaleById); // ✅ Added line for invoice
router.delete('/:id', salesController.deleteSale);
router.put('/:id', salesController.updateSale);
router.get('/report', salesController.getSalesReport);


module.exports = router;
const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const Sale = require('../models/Sale');
const Storage = require('../models/Storage');

// GET /api/stock/summary
router.get('/summary', async (req, res) => {
  try {
    const purchases = await Purchase.aggregate([
      { $group: { _id: "$variety", total: { $sum: "$totalWeight" } } }
    ]);

    const sales = await Sale.aggregate([
      { $group: { _id: "$product", total: { $sum: "$quantity" } } }
    ]);

    const storageIn = await Storage.aggregate([
      { $group: { _id: "$product", total: { $sum: "$quantity" } } }
    ]);

    const storageOut = await Storage.aggregate([
      { $match: { outDate: { $ne: null } } },
      { $group: { _id: "$product", total: { $sum: "$quantity" } } }
    ]);

    const stockMap = {};

    // Add purchases
    purchases.forEach(p => {
      stockMap[p._id] = { product: p._id, in: p.total, out: 0 };
    });

    // Add storage ins
    storageIn.forEach(s => {
      if (!stockMap[s._id]) stockMap[s._id] = { product: s._id, in: 0, out: 0 };
      stockMap[s._id].in += s.total;
    });

    // Add sales
    sales.forEach(s => {
      if (!stockMap[s._id]) stockMap[s._id] = { product: s._id, in: 0, out: 0 };
      stockMap[s._id].out += s.total;
    });

    // Add storage outs
    storageOut.forEach(s => {
      if (!stockMap[s._id]) stockMap[s._id] = { product: s._id, in: 0, out: 0 };
      stockMap[s._id].out += s.total;
    });

    const result = Object.values(stockMap).map(entry => ({
      product: entry.product,
      totalIn: entry.in,
      totalOut: entry.out,
      available: entry.in - entry.out
    }));

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch stock summary' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  addStorage,
  getAllStorage,
    getStorageById,
    updateStorage,
    deleteStorage
} = require('../controllers/storageController');

router.post('/add', addStorage);
router.get('/all', getAllStorage);

router.get('/:id', getStorageById);              // for Edit
router.put('/update/:id', updateStorage);        // for Edit
router.delete('/:id', deleteStorage);            // for Delete


module.exports = router;
// server/models/StockHistory.js

const mongoose = require('mongoose');

const stockHistorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['in', 'out'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  remarks: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('StockHistory', stockHistorySchema);
const express = require('express');
const router = express.Router();
const { manualStockUpdate, getStockList, getStockHistory } = require('../controllers/stockController');

// POST /api/stock/manual
router.post('/manual', manualStockUpdate);

// GET /api/stock/list
router.get('/list', getStockList);

router.get('/history/:itemName', getStockHistory);


module.exports = router;
const StockHistory = require('../models/StockHistory');

exports.manualStockUpdate = async (req, res) => {
  const { itemName, quantity, type, remarks } = req.body;
  const qty = parseFloat(quantity);
  
  try {
    const stock = await Stock.findOne({ itemName });

    if (!stock) {
      await Stock.create({
        itemName,
        totalIn: type === 'in' ? qty : 0,
        totalOut: type === 'out' ? qty : 0,
        currentStock: type === 'in' ? qty : -qty,
        lastUpdated: new Date(),
        remarks
      });
    } else {
      stock.totalIn += type === 'in' ? qty : 0;
      stock.totalOut += type === 'out' ? qty : 0;
      stock.currentStock += type === 'in' ? qty : -qty;
      stock.lastUpdated = new Date();
      await stock.save();
    }

    // Save history log ✅
    await StockHistory.create({
      itemName,
      type,
      quantity: qty,
      remarks
    });

    res.status(200).json({ message: 'Stock updated' });
  } catch (err) {
    console.error("Stock update failed", err.message);
    res.status(500).json({ error: 'Stock update failed' });
  }
};

exports.getStockHistory = async (req, res) => {
  const { itemName } = req.params;
  try {
    const logs = await StockHistory.find({ itemName }).sort({ date: -1 });
    res.status(200).json(logs);
  } catch (err) {
    console.error("Stock history fetch failed", err.message);
    res.status(500).json({ error: 'Failed to fetch stock history' });
  }
};
exports.getStockList = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.status(200).json(stocks);
  } catch (err) {
    console.error("Failed to fetch stock list", err.message);
    res.status(500).json({ error: 'Failed to fetch stock list' });
  }
};const dotenv = require('dotenv');
const farmerRoutes = require('./routes/farmerRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const salesRoutes = require('./routes/salesRoutes');
const customerRoutes = require('./routes/customerRoutes');
const storageRoutes = require('./routes/storageRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config(); // ✅ Sabse upar hona chahiye

const express = require('express');
const connectDB = require('./config/db');
const otpRoutes = require('./routes/otpRoutes');
const cors = require('cors');
const stockRoutes = require('./routes/stockRoutes');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/otp', otpRoutes);

app.use('/api/farmers', farmerRoutes);


app.use('/api/purchases', purchaseRoutes);


app.use('/api/sales', salesRoutes);


app.use('/api/customers', customerRoutes);

app.use('/api/storage', storageRoutes);


app.use('/api/payments', paymentRoutes);

app.use('/api/stock', stockRoutes);





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
const Purchase = require('../models/Purchase');
const Farmer = require('../models/Farmer');


// Helper function to calculate purchase totals
const calculatePurchaseTotals = (bags, weightPerBag, ratePerKg) => {
  const totalWeight = (Number(bags) * Number(weightPerBag)).toFixed(2);
  const amount = (totalWeight * Number(ratePerKg)).toFixed(2);
  return {
    totalWeight: parseFloat(totalWeight),
    amount: parseFloat(amount)
  };
};

// Add new purchase
exports.addPurchase = async (req, res) => {
  try {
    const { farmerId, purchaseDate, variety, bags, weightPerBag, ratePerKg, quality, remarks } = req.body;

    // Validate required fields
    if (!farmerId || !variety || !bags || !weightPerBag || !ratePerKg) {
      return res.status(400).json({ 
        success: false,
        message: 'Farmer ID, variety, bags, weight and rate are required fields' 
      });
    }

    // Validate farmer exists
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Calculate totals
    const { totalWeight, amount } = calculatePurchaseTotals(bags, weightPerBag, ratePerKg);

    const newPurchase = new Purchase({
      farmerId,
      purchaseDate: purchaseDate || Date.now(),
      variety,
      bags: Number(bags),
      weightPerBag: Number(weightPerBag),
      totalWeight,
      ratePerKg: Number(ratePerKg),
      amount,
      quality: quality || 'Other',
      remarks
    });

    const savedPurchase = await newPurchase.save();
    
    res.status(201).json({
      success: true,
      message: 'Purchase added successfully',
      purchase: savedPurchase
    });

  } catch (error) {
    console.error('Error adding purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding purchase',
      error: error.message
    });
  }
};

// Get all purchases with pagination and filters
exports.getAllPurchases = async (req, res) => {
  try {
    const { page = 1, limit = 10, farmerId, fromDate, toDate, quality, search } = req.query;

    let query = {};

    // Add filters
    if (farmerId) query.farmerId = farmerId;
    if (quality) query.quality = quality;
    
    // Date range filter
    if (fromDate || toDate) {
      query.purchaseDate = {};
      if (fromDate) query.purchaseDate.$gte = new Date(fromDate);
      if (toDate) query.purchaseDate.$lte = new Date(toDate);
    }

    // Search filter (for variety or farmer name)
    if (search) {
      const farmers = await Farmer.find({ 
        name: { $regex: search, $options: 'i' } 
      }).select('_id');
      
      query.$or = [
        { variety: { $regex: search, $options: 'i' } },
        { farmerId: { $in: farmers.map(f => f._id) } }
      ];
    }

    const purchases = await Purchase.find(query)
      .populate('farmerId', 'name phone')
      .sort({ purchaseDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Purchase.countDocuments(query);

    res.status(200).json({
      success: true,
      count: purchases.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      purchases
    });

  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching purchases',
      error: error.message
    });
  }
};

// Get single purchase by ID
   // Get single purchase by ID
   exports.getPurchaseById = async (req, res) => {
     try {
       const purchaseId = req.params.id;

       // Validate ObjectId
       if (!mongoose.Types.ObjectId.isValid(purchaseId)) {
        
         return res.status(400).json({ success: false, message: 'Invalid purchase ID' });

       }

       const purchase = await Purchase.findById(purchaseId)

         .populate('farmerId', 'name phone address');

       if (!purchase) {
         return res.status(404).json({ success: false, message: 'Purchase not found' });
       }

       res.status(200).json({ success: true, purchase });
     } catch (error) {
       console.error('Error fetching purchase:', error);
       res.status(500).json({ success: false, message: 'Server error while fetching purchase', error: error.message });
     }
   };
   

// Update purchase
exports.updatePurchase = async (req, res) => {
  try {
    const { farmerId, purchaseDate, variety, bags, weightPerBag, ratePerKg, quality, remarks } = req.body;

    // Validate required fields
    if (!farmerId || !variety || !bags || !weightPerBag || !ratePerKg) {
      return res.status(400).json({ 
        success: false,
        message: 'Farmer ID, variety, bags, weight and rate are required fields' 
      });
    }

    // Calculate totals
    const { totalWeight, amount } = calculatePurchaseTotals(bags, weightPerBag, ratePerKg);

    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      {
        farmerId,
        purchaseDate,
        variety,
        bags: Number(bags),
        weightPerBag: Number(weightPerBag),
        totalWeight,
        ratePerKg: Number(ratePerKg),
        amount,
        quality: quality || 'Other',
        remarks,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!updatedPurchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Purchase updated successfully',
      purchase: updatedPurchase
    });

  } catch (error) {
    console.error('Error updating purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating purchase',
      error: error.message
    });
  }
};

// Delete purchase
exports.deletePurchase = async (req, res) => {
  try {
    const deletedPurchase = await Purchase.findByIdAndDelete(req.params.id);

    if (!deletedPurchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Purchase deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting purchase',
      error: error.message  
    });
  }
};

// Get purchase report with filters
exports.getPurchaseReport = async (req, res) => {
  try {
    const { fromDate, toDate, farmerId } = req.query;
    let query = {};
    if (fromDate || toDate) {

      query.purchaseDate = {};

      if (fromDate) query.purchaseDate.$gte = new Date(fromDate);
      if (toDate) query.purchaseDate.$lte = new Date(new Date(toDate).setHours(23, 59, 59, 999));
    }
    if (farmerId) {
      query.farmerId = farmerId;
    }
    const reports = await Purchase.find(query)
      .populate('farmerId', 'name phone')
      .sort({ purchaseDate: 1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching purchase report:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching report' });
  }

};// Get purchase report with filters
// Get purchase report with filters
exports.getPurchaseReport = async (req, res) => {
  try {
    const { fromDate, toDate, farmerId } = req.query;

    // Validate farmerId
    console.log(mongoose.Types.ObjectId.isValid(farmerId)); // यह true होना चाहिए

    let query = {};

    if (fromDate || toDate) {
      query.purchaseDate = {};
      if (fromDate) query.purchaseDate.$gte = new Date(fromDate);
      if (toDate) query.purchaseDate.$lte = new Date(new Date(toDate).setHours(23, 59, 59, 999));
    }

    if (farmerId && mongoose.Types.ObjectId.isValid(farmerId)) {
      query.farmerId = farmerId;
    } else if (farmerId) {
      return res.status(400).json({ success: false, message: 'Invalid farmer ID' });
    }

    const reports = await Purchase.find(query)
      .populate('farmerId', 'name phone')
      .sort({ purchaseDate: 1 });

    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching purchase report:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching report' });
  }
};
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// POST /api/payments/add
router.post('/add', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json({ message: 'Payment saved' });
  } catch (err) {
    res.status(500).json({ message: 'Payment failed', error: err.message });
  }
});

module.exports = router;
// MultipleFiles/routes/purchaseRoutes.js
const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

// Route to add a new purchase
router.post('/', purchaseController.addPurchase);

// Route to get all purchases (with pagination, sorting, filtering)
router.get('/all', purchaseController.getAllPurchases);

// Route to get a single purchase by ID
router.get('/:id', purchaseController.getPurchaseById);

// Route to update a purchase by ID
router.put('/:id', purchaseController.updatePurchase);

// Route to delete a purchase by ID
router.delete('/:id', purchaseController.deletePurchase);

// Route to get purchase report

router.get('/report', purchaseController.getPurchaseReport);




module.exports = router;
