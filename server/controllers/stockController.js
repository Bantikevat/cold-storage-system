const Stock = require("../models/Stock");
const Sale = require("../models/Sale");
const Purchase = require("../models/Purchase");

// Get all stock items
exports.getAllStock = async (req, res) => {
  try {
    const stock = await Stock.find().sort({ productName: 1 });
    res.status(200).json(stock);
  } catch (err) {
    console.error("Error fetching stock:", err);
    res.status(500).json({ message: "Failed to fetch stock", error: err.message });
  }
};

// Get stock by ID
exports.getStockById = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findById(id);
    if (!stock) return res.status(404).json({ message: "Stock item not found" });
    res.status(200).json(stock);
  } catch (err) {
    console.error("Error fetching stock:", err);
    res.status(500).json({ message: "Failed to fetch stock", error: err.message });
  }
};

// Add new stock item
exports.addStock = async (req, res) => {
  try {
    const { productName, currentStock, minStockAlert } = req.body;

    // Validate input
    if (!productName || currentStock === undefined) {
      return res.status(400).json({ message: "Product name and current stock are required" });
    }

    // Check if product already exists
    const existingStock = await Stock.findOne({ productName });
    if (existingStock) {
      return res.status(400).json({ message: "Product already exists in stock" });
    }

    const newStock = new Stock({
      productName,
      currentStock: Number(currentStock),
      minStockAlert: Number(minStockAlert) || 10
    });

    const savedStock = await newStock.save();
    res.status(201).json(savedStock);
  } catch (err) {
    console.error("Error adding stock:", err);
    res.status(500).json({ message: "Failed to add stock", error: err.message });
  }
};

// Update stock item
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentStock, minStockAlert } = req.body;

    const updatedStock = await Stock.findByIdAndUpdate(
      id,
      {
        currentStock: Number(currentStock),
        minStockAlert: Number(minStockAlert) || 10
      },
      { new: true, runValidators: true }
    );

    if (!updatedStock) {
      return res.status(404).json({ message: "Stock item not found" });
    }

    res.status(200).json(updatedStock);
  } catch (err) {
    console.error("Error updating stock:", err);
    res.status(500).json({ message: "Failed to update stock", error: err.message });
  }
};

// Delete stock item
exports.deleteStock = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStock = await Stock.findByIdAndDelete(id);
    
    if (!deletedStock) {
      return res.status(404).json({ message: "Stock item not found" });
    }

    res.status(200).json({ message: "Stock item deleted successfully" });
  } catch (err) {
    console.error("Error deleting stock:", err);
    res.status(500).json({ message: "Failed to delete stock", error: err.message });
  }
};

// Get comprehensive stock report
exports.getStockReport = async (req, res) => {
  try {
    // Get all stock items
    const stockItems = await Stock.find().sort({ productName: 1 });

    // Get all sales data
    const sales = await Sale.find();
    
    // Get all purchase data
    const purchases = await Purchase.find();

    // Calculate total purchases and sales by product
    const purchaseSummary = {};
    const salesSummary = {};

    purchases.forEach(purchase => {
      const product = purchase.variety || purchase.productName;
      if (product) {
        if (!purchaseSummary[product]) {
          purchaseSummary[product] = {
            totalQuantity: 0,
            totalAmount: 0,
            purchases: []
          };
        }
        purchaseSummary[product].totalQuantity += purchase.totalWeight || 0;
        purchaseSummary[product].totalAmount += purchase.amount || 0;
        purchaseSummary[product].purchases.push(purchase);
      }
    });

    sales.forEach(sale => {
      const product = sale.product;
      if (product) {
        if (!salesSummary[product]) {
          salesSummary[product] = {
            totalQuantity: 0,
            totalAmount: 0,
            sales: []
          };
        }
        salesSummary[product].totalQuantity += sale.quantity || 0;
        salesSummary[product].totalAmount += sale.amount || 0;
        salesSummary[product].sales.push(sale);
      }
    });

    // Create comprehensive report
    const report = stockItems.map(stockItem => {
      const productName = stockItem.productName;
      const purchaseData = purchaseSummary[productName] || { totalQuantity: 0, totalAmount: 0, purchases: [] };
      const salesData = salesSummary[productName] || { totalQuantity: 0, totalAmount: 0, sales: [] };

      return {
        productName,
        currentStock: stockItem.currentStock,
        minStockAlert: stockItem.minStockAlert,
        totalPurchased: purchaseData.totalQuantity,
        totalPurchasedAmount: purchaseData.totalAmount,
        totalSold: salesData.totalQuantity,
        totalSoldAmount: salesData.totalAmount,
        netChange: purchaseData.totalQuantity - salesData.totalQuantity,
        stockStatus: stockItem.currentStock <= stockItem.minStockAlert ? 'LOW_STOCK' : 'OK',
        lastUpdated: stockItem.updatedAt
      };
    });

    // Calculate overall totals
    const overallTotals = {
      totalProducts: stockItems.length,
      totalCurrentStock: stockItems.reduce((sum, item) => sum + item.currentStock, 0),
      totalPurchased: Object.values(purchaseSummary).reduce((sum, item) => sum + item.totalQuantity, 0),
      totalSold: Object.values(salesSummary).reduce((sum, item) => sum + item.totalQuantity, 0),
      totalInvestment: Object.values(purchaseSummary).reduce((sum, item) => sum + item.totalAmount, 0),
      totalRevenue: Object.values(salesSummary).reduce((sum, item) => sum + item.totalAmount, 0),
      lowStockItems: stockItems.filter(item => item.currentStock <= item.minStockAlert).length
    };

    res.status(200).json({
      report,
      overallTotals,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Error generating stock report:", err);
    res.status(500).json({ message: "Failed to generate stock report", error: err.message });
  }
};
