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
        message: "सभी required fields भरना जरूरी है",
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

    // Update stock for the purchased product
    const stock = await Stock.findOne({ productName: variety });
    if (stock) {
      stock.currentStock += totalWeight;
      await stock.save();
    } else {
      const newStock = new Stock({
        productName: variety,
        currentStock: totalWeight,
        minStockAlert: 50,
      });
      await newStock.save();
    }

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
    if (coldStorage) query.coldStorage = { $regex: coldStorage, $options: "i" };
    if (vehicleNo)
      query.vehicleNo = { $regex: vehicleNo.toUpperCase(), $options: "i" };

    // Date range filter
    if (fromDate || toDate) {
      query.purchaseDate = {};
      if (fromDate) query.purchaseDate.$gte = new Date(fromDate);
      if (toDate) query.purchaseDate.$lte = new Date(toDate);
    }

    // Search filter
    if (search) {
      const farmers = await Farmer.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      query.$or = [
        { variety: { $regex: search, $options: "i" } },
        { lotNo: { $regex: search.toUpperCase(), $options: "i" } },
        { vehicleNo: { $regex: search.toUpperCase(), $options: "i" } },
        { transport: { $regex: search, $options: "i" } },
        { farmerId: { $in: farmers.map((f) => f._id) } },
      ];
    }

    const purchases = await Purchase.find(query)
      .populate("farmerId", "name phone address")
      .sort({ purchaseDate: -1, createdAt: -1 })
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
        message: "सभी required fields भरना जरूरी है",
      });
    }

    // Calculate totals
    const { totalWeight, amount } = calculatePurchaseTotals(
      bags,
      weightPerBag,
      ratePerKg
    );

    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      {
        purchaseDate,
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
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedPurchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Purchase updated successfully",
      purchase: updatedPurchase,
    });
  } catch (error) {
    console.error("Error updating purchase:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating purchase",
      error: error.message,
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
        message: "Purchase not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Purchase deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting purchase:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting purchase",
      error: error.message,
    });
  }
};

// Get field suggestions for auto-fill
exports.getFieldSuggestions = async (req, res) => {
  try {
    const { field, farmerId } = req.query;
    
    console.log("Suggestions request received:", { field, farmerId });
    
    if (!field) {
      return res.status(400).json({
        success: false,
        message: "Field parameter is required"
      });
    }

    // Validate that the field is one of the allowed fields
    const allowedFields = ['coldStorage', 'vehicleNo', 'lotNo', 'transport'];
    if (!allowedFields.includes(field)) {
      return res.status(400).json({
        success: false,
        message: "Invalid field parameter. Allowed fields: coldStorage, vehicleNo, lotNo, transport"
      });
    }

    let query = {};
    if (farmerId) {
      // Validate farmerId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(farmerId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid farmer ID format"
        });
      }
      query.farmerId = farmerId;
    }

    console.log("Database query:", query);

    // Get distinct values for the requested field
    const suggestions = await Purchase.find(query)
      .distinct(field)
      .sort();

    console.log("Suggestions found:", suggestions);

    res.status(200).json({
      success: true,
      field,
      suggestions: suggestions.filter(s => s && s.trim() !== '')
    });
  } catch (error) {
    console.error("Error fetching field suggestions:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching suggestions",
      error: error.message,
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
      if (toDate)
        query.purchaseDate.$lte = new Date(
          new Date(toDate).setHours(23, 59, 59, 999)
        );
    }

    // Farmer ID filter
    if (farmerId && mongoose.Types.ObjectId.isValid(farmerId)) {
      query.farmerId = farmerId;
    }

    // Cold storage filter
    if (coldStorage) {
      query.coldStorage = { $regex: coldStorage, $options: "i" };
    }

    // Quality filter
    if (quality) {
      query.quality = quality;
    }

    const reports = await Purchase.find(query)
      .populate("farmerId", "name phone address")
      .sort({ purchaseDate: 1 });

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching purchase report:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching report",
    });
  }
};
