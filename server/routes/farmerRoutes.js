// MultipleFiles/routes/farmerRoutes.js
const express = require("express");
const router = express.Router();
const farmerController = require("../controllers/farmerController"); // Adjust path

// Route to add a new farmer
router.post("/add", farmerController.addFarmer);

// Route to get all farmers (now handles pagination, sorting, searching via query params)
router.get("/all", farmerController.getAllFarmers);

// Route to get a single farmer by ID
router.get("/:id", farmerController.getFarmerById);

// Route to update a farmer by ID
router.put("/update/:id", farmerController.updateFarmer);

// Route to delete a farmer by ID
router.delete("/delete/:id", farmerController.deleteFarmer);

// NEW: Route to get farmer ledger
router.get("/ledger/:farmerId", farmerController.getFarmerLedger);

module.exports = router;
