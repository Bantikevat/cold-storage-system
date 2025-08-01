import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AddStorage = () => {
  const [form, setForm] = useState({
    farmerId: '',
    product: '',
    quantity: '',
    room: '',
    rate: '',
    storageDate: new Date().toISOString().split('T')[0],
    outDate: '',
    remarks: ''
  });

  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingFarmers, setFetchingFarmers] = useState(true);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // 🔹 Fetch all farmers
  useEffect(() => {
    setFetchingFarmers(true);
    axios.get('https://cold-storage-system.onrender.com/api/farmers/all')
      .then(res => {
        setFarmers(res.data);
        setFetchingFarmers(false);
      })
      .catch(err => {
        console.error('❌ Farmer fetch error:', err);
        setNotification({
          show: true,
          type: 'error',
          message: 'Failed to load farmers. Please refresh and try again.'
        });
        setFetchingFarmers(false);
      });
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Optional Validation
    if (!form.rate || Number(form.rate) <= 0) {
      setNotification({
        show: true,
        type: 'error',
        message: '❌ Please enter a valid rate per kg/day.'
      });
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/storage/add', form);
      setNotification({
        show: true,
        type: 'success',
        message: '✅ Storage Entry Added Successfully!'
      });
      setForm({
        farmerId: '',
        product: '',
        quantity: '',
        room: '',
        rate: '',
        storageDate: new Date().toISOString().split('T')[0],
        outDate: '',
        remarks: ''
      });
      
      // Auto hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
    } catch (err) {
      console.error('❌ Error adding storage entry:', err);
      setNotification({
        show: true,
        type: 'error',
        message: '❌ Failed to add storage entry: ' + (err.response?.data?.message || 'Unknown error')
      });
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
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-white">➕ Add Storage Entry</h2>
              <Link 
                to="/storage-list" 
                className="text-sm bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1.5 rounded-md transition-all flex items-center justify-center gap-1 w-max"
              >
                📋 View List
              </Link>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-6">
            {/* Notification Banner */}
            {notification.show && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 p-3 rounded-md text-sm ${
                  notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {notification.message}
                <button 
                  onClick={() => setNotification({ show: false, type: '', message: '' })} 
                  className="float-right text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 👤 Farmer Dropdown */}
              <div className="space-y-1">
                <label htmlFor="farmerId" className="text-sm font-medium text-gray-700">👤 Select Farmer</label>
                <select
                  id="farmerId"
                  name="farmerId"
                  value={form.farmerId}
                  onChange={handleChange}
                  disabled={fetchingFarmers}
                  className={`w-full border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors ${
                    fetchingFarmers ? 'bg-gray-100 cursor-wait' : ''
                  }`}
                  required
                >
                  <option value="">Select a farmer</option>
                  {farmers.map(f => (
                    <option key={f._id} value={f._id}>
                      {f.name} ({f.phone})
                    </option>
                  ))}
                </select>
                {fetchingFarmers && (
                  <p className="text-xs text-gray-500 mt-1">Loading farmers...</p>
                )}
              </div>

              {/* Grid for smaller fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 📦 Product */}
                <div className="space-y-1">
                  <label htmlFor="product" className="text-sm font-medium text-gray-700">📦 Product</label>
                  <input
                    id="product"
                    type="text"
                    name="product"
                    value={form.product}
                    onChange={handleChange}
                    placeholder="Product Name"
                    className="w-full border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                    required
                  />
                </div>

                {/* ⚖️ Quantity */}
                <div className="space-y-1">
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-700">⚖️ Quantity (kg)</label>
                  <input
                    id="quantity"
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    className="w-full border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                    required
                  />
                </div>

                {/* ❄️ Room */}
                <div className="space-y-1">
                  <label htmlFor="room" className="text-sm font-medium text-gray-700">❄️ Cold Room</label>
                  <select
                    id="room"
                    name="room"
                    value={form.room}
                    onChange={handleChange}
                    className="w-full border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                    required
                  >
                    <option value="">Select room</option>
                    <option value="Room-1">Room-1</option>
                    <option value="Room-2">Room-2</option>
                    <option value="Room-3">Room-3</option>
                  </select>
                </div>

                {/* 💰 Rate */}
                <div className="space-y-1">
                  <label htmlFor="rate" className="text-sm font-medium text-gray-700">💰 Rate (₹/kg/day)</label>
                  <input
                    id="rate"
                    type="number"
                    name="rate"
                    value={form.rate}
                    onChange={handleChange}
                    placeholder="Enter rate"
                    className="w-full border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                    step="0.01"
                    required
                  />
                </div>

                {/* 📅 Storage Date */}
                <div className="space-y-1">
                  <label htmlFor="storageDate" className="text-sm font-medium text-gray-700">📅 Storage Date</label>
                  <input
                    id="storageDate"
                    type="date"
                    name="storageDate"
                    value={form.storageDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                    required
                  />
                </div>

                {/* 📅 Out Date */}
                <div className="space-y-1">
                  <label htmlFor="outDate" className="text-sm font-medium text-gray-700">📅 Expected Out Date</label>
                  <input
                    id="outDate"
                    type="date"
                    name="outDate"
                    value={form.outDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional</p>
                </div>
              </div>

              {/* 📝 Remarks */}
              <div className="space-y-1">
                <label htmlFor="remarks" className="text-sm font-medium text-gray-700">📝 Remarks</label>
                <textarea
                  id="remarks"
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  placeholder="Additional notes (optional)"
                  className="w-full border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                  rows="3"
                ></textarea>
              </div>

              {/* ✅ Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full transition-colors flex items-center justify-center gap-2 ${
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
                  '✅ Submit'
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default AddStorage;
