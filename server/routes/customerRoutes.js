// routes/customerRoutes.js

const express = require('express');

const router = express.Router();

const {
  addCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');

// Routes
router.post('/add', addCustomer);
router.get('/all', getAllCustomers);
router.get('/:id', getCustomerById);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;
