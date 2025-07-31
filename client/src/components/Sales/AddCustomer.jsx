// src/components/customer/AddCustomer.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../layout/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AddCustomer = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Validate form fields
      if (!form.name || !form.phone || !form.email || !form.address) {
        setMessage({ type: 'error', text: '❌ All fields are required.' });
        setLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:5000/api/customers/add', form);
      setMessage({ type: 'success', text: '✅ Customer added successfully!' });
      setForm({ name: '', phone: '', email: '', address: '' });
    } catch (err) {
      console.error('Error adding customer:', err.response ? err.response.data : err.message);
      setMessage({ type: 'error', text: '❌ Failed to add customer. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl mx-auto my-2 sm:my-4 px-3 sm:px-4"
      >
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 to-sky-500 px-4 py-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-white">➕ Add New Customer</h2>
              <Link 
                to="/customer-list" 
                className="text-sm bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1.5 rounded-md transition-all flex items-center justify-center gap-1 w-max"
              >
                📋 View List
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="p-4 sm:p-6">
            {message.text && (
              <div className={`mb-4 p-3 rounded-md text-sm ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.text}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  className="w-full border border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full border border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full border border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="address" className="text-sm font-medium text-gray-700">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  className="w-full border border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                  rows={3}
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md w-full transition-colors flex items-center justify-center gap-2 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>➕ Add Customer</>
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default AddCustomer;
