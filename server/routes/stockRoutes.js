const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.post('/add', stockController.addStock);
router.get('/', stockController.getAllStock);
router.get('/:id', stockController.getStockById);
router.put('/update/:id', stockController.updateStock);
router.delete('/delete/:id', stockController.deleteStock);

module.exports = router;
