// MultipleFiles/ff.js (या routes/purchaseRoutes.js)
const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

// अन्य रूट्स को पहले रखें
router.post('/', purchaseController.addPurchase);
router.get('/all', purchaseController.getAllPurchases); // जैसे /api/purchases/all

// ✅ रिपोर्ट रूट को ID वाले रूट से पहले रखें
router.get('/report', purchaseController.getPurchaseReport); // ✅ यह पहले आना चाहिए

// ✅ ID-आधारित रूट को अंत में रखें
router.get('/:id', purchaseController.getPurchaseById); // ✅ यह बाद में आना चाहिए
router.put('/:id', purchaseController.updatePurchase);
router.delete('/:id', purchaseController.deletePurchase);

module.exports = router;
