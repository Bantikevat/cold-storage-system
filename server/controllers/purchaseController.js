const Purchase = require('../models/Purchase');
const Farmer = require('../models/Farmer');
const Stock = require('../models/Stock'); // Stock को आयात करें
const mongoose = require('mongoose');

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

    // Update stock for the purchased product
    const stock = await Stock.findOne({ productName: variety });
    if (stock) {
      stock.currentStock += totalWeight; // Increase stock
      await stock.save(); // Save updated stock
    } else {
      // If stock does not exist, you may want to create a new stock entry
      const newStock = new Stock({
        productName: variety,
        currentStock: totalWeight,
        minStockAlert: 10 // Set a default value or adjust as needed
      });
      await newStock.save();
    }

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

// Get purchase report
exports.getPurchaseReport = async (req, res) => {
  try {
    const { fromDate, toDate, farmerId } = req.query;

    let query = {};
    
    // Date range filter
    if (fromDate || toDate) {
      query.purchaseDate = {};
      if (fromDate) query.purchaseDate.$gte = new Date(fromDate);
      if (toDate) query.purchaseDate.$lte = new Date(new Date(toDate).setHours(23, 59, 59, 999));
    }

    // Farmer ID filter
    if (farmerId && mongoose.Types.ObjectId.isValid(farmerId)) {
      query.farmerId = farmerId;
    }

    console.log('🛠 Final Mongo Query:', query);

    const reports = await Purchase.find(query)
      .populate('farmerId', 'name phone')
      .sort({ purchaseDate: 1 });

    console.log('✅ Report Count:', reports.length);
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching purchase report:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching report' });
  }
};
