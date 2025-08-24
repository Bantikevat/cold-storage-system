const express = require("express");
const {
  addPurchase,
  getAllPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
  getFieldSuggestions,
  getPurchaseReport,
} = require("../controllers/purchaseController");

const router = express.Router();

// Add a new purchase
router.post("/", addPurchase);

// Get all purchases with pagination and filters
router.get("/", getAllPurchases);

// Get a single purchase by ID
router.get("/:id", getPurchaseById);

// Update a purchase by ID
router.put("/:id", updatePurchase);

// Delete a purchase by ID
router.delete("/:id", deletePurchase);

// Get field suggestions for auto-fill
router.get("/suggestions", getFieldSuggestions);

// Get purchase report
router.get("/report", getPurchaseReport);

module.exports = router;
