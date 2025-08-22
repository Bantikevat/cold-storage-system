const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Add Customer
router.post('/add', customerController.addCustomer);

// Get All Customers
router.get('/all', customerController.getAllCustomers);

// Get Customer by ID
router.get('/:id', customerController.getCustomerById);

// Update Customer
router.put('/update/:id', customerController.updateCustomer);

// Delete Customer
router.delete('/delete/:id', customerController.deleteCustomer);

module.exports = router;