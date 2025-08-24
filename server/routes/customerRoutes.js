const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// @route   POST api/customers/add
// @desc    Add a new customer
// @access  Public (for now, can be protected later)
router.post('/add', customerController.addCustomer);

// Get All Customers
router.get('/', customerController.getAllCustomers); // Add base route
router.get('/all', customerController.getAllCustomers);

// Get Customer by ID
router.get('/:id', customerController.getCustomerById);

// Update Customer
router.put('/:id', customerController.updateCustomer);

// Delete Customer
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
