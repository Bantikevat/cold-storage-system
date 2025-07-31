const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.post('/add', salesController.addSale);
router.get('/all', salesController.getAllSales);
router.delete('/:id', salesController.deleteSale);
router.put('/:id', salesController.updateSale);

// ✅ Add this line BEFORE '/:id'
router.get('/report', salesController.getSalesReport);

router.get('/:id', salesController.getSaleById);

module.exports = router;