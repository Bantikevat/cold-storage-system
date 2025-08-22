
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
