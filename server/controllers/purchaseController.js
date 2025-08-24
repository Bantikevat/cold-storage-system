const Purchase = require("../models/Purchase");
const Farmer = require("../models/Farmer");
const mongoose = require("mongoose");

// Helper function to calculate purchase totals
const calculatePurchaseTotals = (bags, weightPerBag, ratePerKg) => {
  const totalWeight = (Number(bags) * Number(weightPerBag)).toFixed(2);
  const amount = (totalWeight * Number(ratePerKg)).toFixed(2);
  return {
    totalWeight: parseFloat(totalWeight),
    amount: parseFloat(amount),
  };
};

// Add new purchase
exports.addPurchase = async (req, res) => {
  try {
    const {
      purchaseDate,
      coldStorage,
      vehicleNo,
      lotNo,
      transport,
      farmerId,
      variety,
      quality,
      bags,
      weightPerBag,
      ratePerKg,
      remarks,
    } = req.body;

    // Validate required fields
    if (
      !farmerId ||
      !coldStorage ||
      !vehicleNo ||
      !lotNo ||
      !transport ||
      !variety ||
      !bags ||
      !weightPerBag ||
      !ratePerKg
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled.",
      });
    }

    // Validate farmer exists
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    // Calculate totals
    const { totalWeight, amount } = calculatePurchaseTotals(
      bags,
      weightPerBag,
      ratePerKg
    );

    const newPurchase = new Purchase({
      purchaseDate: purchaseDate || Date.now(),
      coldStorage,
      vehicleNo: vehicleNo.toUpperCase(),
      lotNo: lotNo.toUpperCase(),
      transport,
      farmerId,
      variety,
      quality: quality || "Other",
      bags: Number(bags),
      weightPerBag: Number(weightPerBag),
      totalWeight,
      ratePerKg: Number(ratePerKg),
      amount,
      remarks: remarks || "",
    });

    const savedPurchase = await newPurchase.save();

    res.status(201).json({
      success: true,
      message: "Purchase successfully added!",
      purchase: savedPurchase,
    });
  } catch (error) {
    console.error("Error adding purchase:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding purchase",
      error: error.message,
    });
  }
};

// Get all purchases with pagination and filters
exports.getAllPurchases = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      farmerId,
      fromDate,
      toDate,
      quality,
      search,
      coldStorage,
      vehicleNo,
    } = req.query;

    let query = {};

    // Add filters
    if (farmerId) query.farmerId = farmerId;
    if (quality) query.quality = quality;
    if (coldStorage) {
      query.coldStorage = { $regex: coldStorage, $options: "i" };
    }
    if (vehicleNo) {
      query.vehicleNo = { $regex: vehicleNo.toUpperCase(), $options: "i" };
    }

    // Date range filter
    if (fromDate || toDate) {
      query.purchaseDate = {};
      if (fromDate) query.purchaseDate.$gte = new Date(fromDate);
      if (toDate) query.purchaseDate.$lte = new Date(toDate);
    }

    const purchases = await Purchase.find(query)
      .populate("farmerId", "name phone address")
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
      purchases,
    });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching purchases",
      error: error.message,
    });
  }
};

// Get single purchase by ID
exports.getPurchaseById = async (req, res) => {
  try {
    const purchaseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(purchaseId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid purchase ID" });
    }

    const purchase = await Purchase.findById(purchaseId).populate(
      "farmerId",
      "name phone address"
    );

    if (!purchase) {
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });
    }

    res.status(200).json({ success: true, purchase });
  } catch (error) {
    console.error("Error fetching purchase:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching purchase",
      error: error.message,
    });
  }
};

// Update purchase
exports.updatePurchase = async (req, res) => {
  try {
    const updated = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

// Delete purchase
exports.deletePurchase = async (req, res) => {
  try {
    const deleted = await Purchase.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    res.status(200).json({ message: "Purchase deleted successfully" });
  } catch (error) {
    console.error("Error deleting purchase:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting purchase",
      error: error.message,
    });
  }
};

// Get field suggestions for auto-fill
exports.getFieldSuggestions = async (req, res) => {
  try {
    const { field, search } = req.query;
    
    if (!field) {
      return res.status(400).json({
        success: false,
        message: "Field parameter is required"
      });
    }

    let suggestions = [];
    const searchRegex = new RegExp(search || '', 'i');

    switch (field) {
      case 'coldStorage':
        suggestions = await Purchase.distinct('coldStorage', { 
          coldStorage: searchRegex 
        });
        break;
      case 'vehicleNo':
        suggestions = await Purchase.distinct('vehicleNo', { 
          vehicleNo: searchRegex 
        });
        break;
      case 'variety':
        suggestions = await Purchase.distinct('variety', { 
          variety: searchRegex 
        });
        break;
      case 'quality':
        suggestions = await Purchase.distinct('quality', { 
          quality: searchRegex 
        });
        break;
      case 'transport':
        suggestions = await Purchase.distinct('transport', { 
          transport: searchRegex 
        });
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid field parameter"
        });
    }

    res.status(200).json({
      success: true,
      suggestions: suggestions.filter(s => s).slice(0, 10) // Limit to 10 suggestions
    });
  } catch (error) {
    console.error("Error fetching field suggestions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch field suggestions",
      error: error.message
    });
  }
};

// Get purchase report
exports.getPurchaseReport = async (req, res) => {
  try {
    const { fromDate, toDate, farmerId, coldStorage, quality } = req.query;

    let query = {};

    // Date range filter
    if (fromDate || toDate) {
      query.purchaseDate = {};
      if (fromDate) query.purchaseDate.$gte = new Date(fromDate);
      if (toDate) {
        query.purchaseDate.$lte = new Date(
          new Date(toDate).setHours(23, 59, 59, 999)
        );
      }
    }

    if (farmerId && mongoose.Types.ObjectId.isValid(farmerId)) {
      query.farmerId = farmerId;
    }

    if (coldStorage) {
      query.coldStorage = { $regex: coldStorage, $options: "i" };
    }

    if (quality) {
      query.quality = quality;
    }

    const reports = await Purchase.find(query)
      .populate("farmerId", "name phone address")
      .sort({ purchaseDate: 1 });

    res.status(200).json({ data: reports });
  } catch (error) {
    console.error("Error fetching purchase report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch purchase report",
    });
  }
};
