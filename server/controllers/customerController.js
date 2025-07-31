
// controllers/customerController.js
const Customer = require('../models/Customer');

// Example of error handling in your controller
exports.addCustomer = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    if (!name || !phone || !email || !address) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const newCustomer = new Customer({ name, phone, email, address });
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ message: "Error creating customer", error: err.message });
  }
};


// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers); // Respond with the list of customers
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch customers', error });
  }
};

// Get a customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer); // Respond with the customer details
  } catch (err) {
    res.status(500).json({ message: 'Error getting customer' });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(updated); // Respond with the updated customer
  } catch (err) {
    res.status(500).json({ message: 'Error updating customer' });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' }); // Respond with success message
  } catch (err) {
    res.status(500).json({ message: 'Error deleting customer' });
  }
};
