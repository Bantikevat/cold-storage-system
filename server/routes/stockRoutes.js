const express = require("express");
const {
  getAllStock,
  getStockById,
  updateStock,
  addStock,
  deleteStock,
  getStockReport
} = require("../controllers/stockController");

const router = express.Router();

// Get all stock items
router.get("/", getAllStock);

// Get stock report
router.get("/report", getStockReport);

// Get stock by ID
router.get("/:id", getStockById);

// Add new stock item
router.post("/", addStock);

// Update stock item
router.put("/:id", updateStock);

// Delete stock item
router.delete("/:id", deleteStock);

module.exports = router;
