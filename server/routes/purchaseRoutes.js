const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

// Purchase routes
router.post('/', purchaseController.addPurchase);
router.get('/all', purchaseController.getAllPurchases);
router.get('/report', purchaseController.getPurchaseReport);
router.get('/suggestions', purchaseController.getFieldSuggestions);
router.get('/:id', purchaseController.getPurchaseById);
router.put('/:id', purchaseController.updatePurchase);
router.delete('/:id', purchaseController.deletePurchase);

module.exports = router;
