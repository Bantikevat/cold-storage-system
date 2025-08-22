const Customer = require("../models/Customer");

// Add Customer
exports.addCustomer = async (req, res) => {
  try {
    console.log("📝 Received customer data:", req.body);
    console.log("📊 Request headers:", req.headers);

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

    if (!name || !name.trim()) {
      console.log("❌ Missing name");
      return res.status(400).json({
        message: "Customer name is required.",
      });
    }

    if (!phone || !phone.trim()) {
      console.log("❌ Missing phone");
      return res.status(400).json({
        message: "Phone number is required.",
      });
    }

    // Clean phone number (remove any spaces or special characters except +)
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    console.log("🧹 Cleaned phone:", cleanPhone);

    // Check if customer with same phone already exists
    const existingCustomer = await Customer.findOne({ phone: cleanPhone });
    if (existingCustomer) {
      console.log("⚠️ Customer already exists:", existingCustomer.name);
      return res.status(400).json({
        message: "Customer with this phone number already exists.",
      });
    }

    const customerData = {
      name: name.trim(),
      phone: cleanPhone,
      email: email ? email.trim() : "",
      address: address ? address.trim() : "",
      city: city ? city.trim() : "",
      state: state ? state.trim() : "",
      gstin: gstin ? gstin.trim() : "",
      creditLimit: creditLimit ? Number(creditLimit) : 0,
      remarks: remarks ? remarks.trim() : "",
    };

    console.log("💾 Creating customer with data:", customerData);

    const newCustomer = new Customer(customerData);
    const savedCustomer = await newCustomer.save();

    console.log("✅ Customer saved successfully:", savedCustomer._id);

    res.status(201).json({
      success: true,
      message: "Customer added successfully",
      customer: savedCustomer,
    });
  } catch (err) {
    console.error("❌ Error creating customer:", err);
    console.error("❌ Error stack:", err.stack);

    if (err.code === 11000) {
      console.log("❌ Duplicate key error");
      return res.status(400).json({
        success: false,
        message: "Customer with this phone number already exists.",
      });
    }

    if (err.name === "ValidationError") {
      console.log("❌ Validation error:", err.errors);
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
      details: process.env.NODE_ENV === "development" ? err.stack : undefined,
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
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({
      message: "Customer updated successfully",
      customer: updated,
    });
  } catch (err) {
    console.error("Error updating customer:", err);

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        message: errors.join(", "),
      });
    }

    res
      .status(500)
      .json({ message: "Error updating customer", error: err.message });
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

const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{10,15}$/.test(v);
      },
      message: 'Please enter a valid phone number (10-15 digits)'
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return !v || /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  address: {
    type: String,
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  city: {
    type: String,
    trim: true,
    maxlength: [50, 'City name cannot exceed 50 characters']
  },
  state: {
    type: String,
    trim: true,
    maxlength: [50, 'State name cannot exceed 50 characters']
  },
  gstin: {
    type: String,
    trim: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        return !v || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
      },
      message: 'Please enter a valid GSTIN'
    }
  },
  creditLimit: {
    type: Number,
    default: 0,
    min: [0, 'Credit limit cannot be negative']
  },
  remarks: {
    type: String,
    trim: true,
    maxlength: [1000, 'Remarks cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Create unique index on phone number
customerSchema.index({ phone: 1 }, { unique: true });

module.exports = mongoose.model('Customer', customerSchema);
const dotenv = require("dotenv");
dotenv.config(); // ✅ Load environment variables at the very top

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");

// Import routes
const farmerRoutes = require("./routes/farmerRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const salesRoutes = require("./routes/salesRoutes");
const customerRoutes = require("./routes/customerRoutes");
const otpRoutes = require("./routes/otpRoutes");

// Initialize app
const app = express();

// ✅ Allow frontend (local + deployed) to access backend
const allowedOrigins = [
  "http://localhost:5173",
  "https://cold-storage-system-1.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// ✅ Connect to MongoDB
connectDB();

// ✅ Optional request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ✅ API Routes
app.use("/api/otp", otpRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/customers", customerRoutes);

// ✅ Error handling (last middleware)
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res
    .status(err.status || 500)
    .json({ error: err.message || "Something went wrong!" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../layout/Layout';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const AddCustomer = () => {
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    gstin: '',
    creditLimit: '',
    remarks: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!customerData.name || !customerData.phone) {
      MySwal.fire({
        icon: 'warning',
        title: 'Missing Information!',
        text: 'Please fill in the customer name and phone number.',
        confirmButtonColor: '#0369a1'
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Sending customer data:', customerData);
      
      const response = await axios.post('https://cold-storage-system.onrender.com/api/customers/add', customerData);
      
      console.log('Customer added successfully:', response.data);
      
      MySwal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Customer added successfully!',
        confirmButtonColor: '#0369a1'
      }).then(() => {
        setCustomerData({
          name: '',
          phone: '',
          email: '',
          address: '',
          city: '',
          state: '',
          gstin: '',
          creditLimit: '',
          remarks: ''
        });
        navigate('/customer-list');
      });

    } catch (err) {
      console.error('❌ Failed to add customer:', err);
      
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
      
      MySwal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Failed to add customer: ${errorMessage}`,
        confirmButtonColor: '#0369a1'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              👥 Add New Customer
            </h1>
            <p className="text-gray-600">Register a new customer in your system</p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">📝 Customer Information</h2>
              <p className="text-blue-100">Please fill in all the customer details</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">👤 Basic Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Customer Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={customerData.name}
                          onChange={handleChange}
                          placeholder="Enter customer full name"
                          className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={customerData.phone}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                          className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={customerData.email}
                          onChange={handleChange}
                          placeholder="Enter email address"
                          className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">🏢 Business Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GSTIN
                        </label>
                        <input
                          type="text"
                          name="gstin"
                          value={customerData.gstin}
                          onChange={handleChange}
                          placeholder="Enter GST number (if applicable)"
                          className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Credit Limit (₹)
                        </label>
                        <input
                          type="number"
                          name="creditLimit"
                          value={customerData.creditLimit}
                          onChange={handleChange}
                          placeholder="Enter credit limit"
                          className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Address Information */}
                  <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-4">📍 Address Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Address
                        </label>
                        <textarea
                          name="address"
                          value={customerData.address}
                          onChange={handleChange}
                          placeholder="Enter complete address"
                          rows="3"
                          className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={customerData.city}
                          onChange={handleChange}
                          placeholder="Enter city name"
                          className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={customerData.state}
                          onChange={handleChange}
                          placeholder="Enter state name"
                          className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                    <h3 className="text-lg font-semibold text-orange-800 mb-4">📝 Additional Information</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Remarks
                      </label>
                      <textarea
                        name="remarks"
                        value={customerData.remarks}
                        onChange={handleChange}
                        placeholder="Enter any additional notes about the customer..."
                        rows="5"
                        className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => navigate('/customer-list')}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  ← Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-white font-semibold ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </div>
                  ) : (
                    '👥 Add Customer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddCustomer;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../layout/Layout';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [customers, searchTerm]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('https://cold-storage-system.onrender.com/api/customers/all');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      MySwal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to fetch customers',
        confirmButtonColor: '#0369a1'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId, customerName) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: `Delete customer: ${customerName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://cold-storage-system.onrender.com/api/customers/delete/${customerId}`);
        MySwal.fire('Deleted!', 'Customer has been deleted.', 'success');
        fetchCustomers(); // Refresh the list
      } catch (error) {
        MySwal.fire('Error!', 'Failed to delete customer.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <span className="ml-4 text-lg text-gray-600">Loading Customers...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              👥 Customer Management
            </h1>
            <p className="text-gray-600">Manage all your customers efficiently</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-3xl font-bold text-blue-600">{customers.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">👥</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Customers</p>
                  <p className="text-3xl font-bold text-green-600">{customers.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">✅</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New This Month</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {customers.filter(c => new Date(c.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">📈</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Add Customer */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search customers by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
              <Link
                to="/add-customer"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                ➕ Add New Customer
              </Link>
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">👥 All Customers ({filteredCustomers.length})</h2>
            </div>
            
            {filteredCustomers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-700">#</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Phone</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Address</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Added Date</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer, index) => (
                      <tr key={customer._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-semibold text-gray-600">{index + 1}</td>
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{customer.name}</div>
                        </td>
                        <td className="p-4">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {customer.phone}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{customer.email}</td>
                        <td className="p-4 text-gray-600 max-w-xs truncate">{customer.address}</td>
                        <td className="p-4 text-gray-600">
                          {new Date(customer.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Link
                              to={`/edit-customer/${customer._id}`}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition-colors text-sm flex items-center gap-1"
                              title="Edit Customer"
                            >
                              ✏️ Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(customer._id, customer.name)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors text-sm flex items-center gap-1"
                              title="Delete Customer"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <p className="text-xl text-gray-500 mb-4">
                  {searchTerm ? 'No customers found matching your search' : 'No customers found'}
                </p>
                <p className="text-gray-400 mb-6">Add your first customer to get started!</p>
                <Link
                  to="/add-customer"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                >
                  ➕ Add First Customer
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerList;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../layout/Layout';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`https://cold-storage-system.onrender.com/api/customers/${id}`);
      setCustomer(response.data);
    } catch (error) {
      console.error('Error fetching customer:', error);
      MySwal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to fetch customer details',
        confirmButtonColor: '#0369a1'
      });
      navigate('/customer-list');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.put(`https://cold-storage-system.onrender.com/api/customers/update/${id}`, customer);
      
      MySwal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Customer updated successfully!',
        confirmButtonColor: '#0369a1'
      }).then(() => {
        navigate('/customer-list');
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      MySwal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update customer',
        confirmButtonColor: '#0369a1'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <span className="ml-4 text-lg text-gray-600">Loading customer details...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              ✏️ Edit Customer
            </h1>
            <p className="text-gray-600">Update customer information</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
              <h2 className="text-2xl font-bold text-white">Customer Details</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  👤 Customer Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={customer.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter customer name"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📞 Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customer.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter 10-digit phone number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📧 Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={customer.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter email address"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📍 Address *
                </label>
                <textarea
                  name="address"
                  value={customer.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Enter complete address"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/customer-list')}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  ← Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                    submitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {submitting ? '⏳ Updating...' : '✅ Update Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditCustomer;
