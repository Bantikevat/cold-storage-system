const Customer = require("../models/Customer");

// Add Customer
exports.addCustomer = async (req, res) => {
  try {
    console.log("📝 Received customer data:", req.body);

    const {
      name,
      phone,
      email,
      address,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Customer name is required.",
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        message: "Phone number is required.",
      });
    }

    const cleanPhone = phone.replace(/[\s\-()]/g, "");

    const existingCustomer = await Customer.findOne({ phone: cleanPhone });
    if (existingCustomer) {
      return res.status(400).json({
        message: "Customer with this phone number already exists.",
      });
    }

    const customerData = {
      name: name.trim(),
      phone: cleanPhone,
      email: email ? email.trim() : "",
      address: address ? address.trim() : "",
    };

    const newCustomer = new Customer(customerData);
    const savedCustomer = await newCustomer.save();

    res.status(201).json({
      success: true,
      message: "Customer added successfully",
      customer: savedCustomer,
    });
  } catch (err) {
    console.error("❌ Error creating customer:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Customer with this phone number already exists.",
      });
    }

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: errors.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating customer",
      error: err.message,
    });
  }
};


// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch customers", error: error.message });
  }
};

// Get a customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (err) {
    console.error("Error getting customer:", err);
    res
      .status(500)
      .json({ message: "Error getting customer", error: err.message });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      city,
      state,
      gstin,
      creditLimit,
      remarks,
    } = req.body;

    // ✅ Phone clean
    const cleanPhone = phone ? phone.replace(/[\s\-\(\)]/g, "") : undefined;

    // ✅ Payload banaya (sirf allowed fields)
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (cleanPhone) updateData.phone = cleanPhone;
    if (email) updateData.email = email.trim();
    if (address) updateData.address = address.trim();
    if (city) updateData.city = city.trim();
    if (state) updateData.state = state.trim();
    if (gstin) updateData.gstin = gstin.trim();
    if (creditLimit !== undefined) updateData.creditLimit = Number(creditLimit);
    if (remarks) updateData.remarks = remarks.trim();

    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: updateData }, // ✅ sirf clean data update hoga
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({
      success: true,
      message: "Customer updated successfully",
      customer: updated,
    });
  } catch (err) {
    console.error("❌ Error updating customer:", err);

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: errors.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating customer",
      error: err.message,
    });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error("Error deleting customer:", err);
    res
      .status(500)
      .json({ message: "Error deleting customer", error: err.message });
  }
};
