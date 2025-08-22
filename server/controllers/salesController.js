// controllers/salesController.js
const Sale = require("../models/Sale");

// Add Sale Function
exports.addSale = async (req, res) => {
  try {
    const {
      clientId,
      customerName,
      product,
      quantity,
      rate,
      saleDate,
      remarks,
    } = req.body;

    // Validate input
    if (!clientId || !product || !quantity || !rate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const amount = quantity * rate;

    const newSale = new Sale({
      clientId,
      customerName,
      product,
      quantity,
      rate,
      amount,
      saleDate,
      remarks,
    });

    const saved = await newSale.save();

    // Update stock
    const stock = await Stock.findOne({ productName: product });
    if (stock) {
      if (stock.currentStock < quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }
      stock.currentStock -= quantity; // Reduce stock
      await stock.save();
    } else {
      return res.status(404).json({ message: "Product not found in stock" });
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error("Error adding sale:", err);
    res.status(500).json({ message: "Failed to add sale", error: err.message });
  }
};

// Get All Sales Function
// controllers/salesController.js
exports.getAllSales = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "saleDate";
    const order = req.query.order === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const total = await Sale.countDocuments();
    const sales = await Sale.find()
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)
      .populate("clientId"); // Ensure clientId is populated if needed

    res.status(200).json({ sales, total });
  } catch (err) {
    console.error("Error fetching sales:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch sales", error: err.message });
  }
};

// controllers/salesController.js

// Delete Sale
exports.deleteSale = async (req, res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// Update Sale
exports.updateSale = async (req, res) => {
  try {
    const updated = await Sale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// ...existing code...

// ✅ Sales Report Controller
exports.getSalesReport = async (req, res) => {
  try {
    const { fromDate, toDate, customerId } = req.query;

    // Build query
    const query = {};
    if (fromDate && toDate) {
      query.saleDate = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }
    if (customerId) {
      query.clientId = customerId;
    }

    const sales = await Sale.find(query).populate("clientId");
    res.status(200).json({ data: sales });
  } catch (err) {
    console.error("Error fetching sales report:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch sales report", error: err.message });
  }
};

// controllers/salesController.js
exports.getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.status(200).json(sale);
  } catch (err) {
    console.error("Error fetching sale:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch sale", error: err.message });
  }
};
