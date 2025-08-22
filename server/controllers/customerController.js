
const Customer = require('../models/Customer');

// Add Customer
exports.addCustomer = async (req, res) => {
  try {
    console.log('📝 Received customer data:', req.body);
    console.log('📊 Request headers:', req.headers);
    
    const { name, phone, email, address, city, state, gstin, creditLimit, remarks } = req.body;
    
    if (!name || !name.trim()) {
      console.log('❌ Missing name');
      return res.status(400).json({ 
        message: "Customer name is required." 
      });
    }

    if (!phone || !phone.trim()) {
      console.log('❌ Missing phone');
      return res.status(400).json({ 
        message: "Phone number is required." 
      });
    }

    // Clean phone number (remove any spaces or special characters except +)
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    console.log('🧹 Cleaned phone:', cleanPhone);

    // Check if customer with same phone already exists
    const existingCustomer = await Customer.findOne({ phone: cleanPhone });
    if (existingCustomer) {
      console.log('⚠️ Customer already exists:', existingCustomer.name);
      return res.status(400).json({ 
        message: "Customer with this phone number already exists." 
      });
    }

    const customerData = { 
      name: name.trim(), 
      phone: cleanPhone, 
      email: email ? email.trim() : '', 
      address: address ? address.trim() : '', 
      city: city ? city.trim() : '',
      state: state ? state.trim() : '',
      gstin: gstin ? gstin.trim() : '',
      creditLimit: creditLimit ? Number(creditLimit) : 0,
      remarks: remarks ? remarks.trim() : ''
    };

    console.log('💾 Creating customer with data:', customerData);
    
    const newCustomer = new Customer(customerData);
    const savedCustomer = await newCustomer.save();
    
    console.log('✅ Customer saved successfully:', savedCustomer._id);
    
    res.status(201).json({
      success: true,
      message: 'Customer added successfully',
      customer: savedCustomer
    });
    
  } catch (err) {
    console.error('❌ Error creating customer:', err);
    console.error('❌ Error stack:', err.stack);
    
    if (err.code === 11000) {
      console.log('❌ Duplicate key error');
      return res.status(400).json({ 
        success: false,
        message: "Customer with this phone number already exists." 
      });
    }
    
    if (err.name === 'ValidationError') {
      console.log('❌ Validation error:', err.errors);
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false,
        message: errors.join(', ') 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Error creating customer", 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Failed to fetch customers', error: error.message });
  }
};

// Get a customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    console.error('Error getting customer:', err);
    res.status(500).json({ message: 'Error getting customer', error: err.message });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({
      message: 'Customer updated successfully',
      customer: updated
    });
  } catch (err) {
    console.error('Error updating customer:', err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        message: errors.join(', ') 
      });
    }
    
    res.status(500).json({ message: 'Error updating customer', error: err.message });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ message: 'Error deleting customer', error: err.message });
  }
};
