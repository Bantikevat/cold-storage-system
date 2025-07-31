const Stock = require('../models/Stock');
const mongoose = require('mongoose');

exports.addStock = async (req, res) => {
  try {
    const { productName, description, currentStock, minStockAlert } = req.body;

    // Validate input
    if (!productName || typeof productName !== 'string' || productName.trim() === '') {
      return res.status(400).json({ message: 'Product Name is required and must be a valid string.' });
    }
    if (isNaN(currentStock) || isNaN(minStockAlert)) {
      return res.status(400).json({ message: 'Current Stock and Minimum Stock Alert must be valid numbers.' });
    }

    // Check if product already exists
    const existing = await Stock.findOne({ productName });
    if (existing) {
      return res.status(400).json({ message: 'Product already exists' });
    }

    const stock = new Stock({
      productName,
      description,
      currentStock,
      minStockAlert,
    });

    await stock.save();
    res.status(201).json(stock);
  } catch (error) {
    console.error('Error adding stock:', error); // Log the error for debugging
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
};



// Get all products in stock
exports.getAllStock = async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ productName: 1 });
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stock', error: error.message });
  }
};

// Get single product by ID
exports.getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Product not found' });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

// Update product details
exports.updateStock = async (req, res) => {
  try {
    const { productName, description, currentStock, threshold } = req.body;
    const updated = await Stock.findByIdAndUpdate(
      req.params.id,
      { productName, description, currentStock, threshold, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

// Delete product
exports.deleteStock = async (req, res) => {
  try {
    const deleted = await Stock.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};
