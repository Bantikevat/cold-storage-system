
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../layout/Layout';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const EditSales = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    product: '',
    quantity: '',
    rate: '',
    saleDate: '',
    remarks: ''
  });
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const res = await axios.get(`https://cold-storage-system-1s.onrender.com/api/sales/${id}`);
        console.log('✅ Fetched Sale Data for Edit:', res.data);
        
        setFormData({
          customerName: res.data.customerName || '',
          product: res.data.product || '',
          quantity: res.data.quantity || '',
          rate: res.data.rate || '',
          saleDate: res.data.saleDate ? new Date(res.data.saleDate).toISOString().split('T')[0] : '',
          remarks: res.data.remarks || ''
        });
      } catch (error) {
        console.error('❌ Error fetching sale:', error);
        MySwal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch sale data. Please try again.',
          confirmButtonColor: '#0369a1'
        });
        navigate('/sales-list');
      } finally {
        setDataLoading(false);
      }
    };

    if (id) fetchSale();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { customerName, product, quantity, rate } = formData;

    if (!customerName || !product || !quantity || !rate) {
      MySwal.fire({
        icon: 'warning',
        title: 'Missing Information!',
        text: 'Please fill in all required fields.',
        confirmButtonColor: '#0369a1'
      });
      return;
    }

    const parsedQuantity = Number(quantity);
    const parsedRate = Number(rate);

    if (isNaN(parsedQuantity) || isNaN(parsedRate) || parsedQuantity <= 0 || parsedRate <= 0) {
      MySwal.fire({
        icon: 'warning',
        title: 'Invalid Input!',
        text: 'Quantity and Rate must be valid positive numbers.',
        confirmButtonColor: '#0369a1'
      });
      return;
    }

    setLoading(true);

    try {
      await axios.put(`https://cold-storage-system-1s.onrender.com/api/sales/${id}`, {
        ...formData,
        quantity: parsedQuantity,
        rate: parsedRate,
        amount: parsedQuantity * parsedRate,
      });
      
      MySwal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Sale updated successfully!',
        confirmButtonColor: '#0369a1'
      }).then(() => {
        navigate('/sales-list');
      });

    } catch (error) {
      console.error('❌ Error updating sale:', error);
      MySwal.fire({
        icon: 'error',
        title: 'Update Failed!',
        text: `Failed to update sale: ${error.response?.data?.message || "Something went wrong"}`,
        confirmButtonColor: '#0369a1'
      });
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading sale data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2">
              ✏️ Edit Sale Record
            </h1>
            <p className="text-gray-600">Update sale information and details</p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-green-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">📝 Sale Information</h2>
              <p className="text-green-100">Update the sale details below</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Customer & Product Details */}
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">👥 Customer & Product</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Customer Name *
                        </label>
                        <input
                          type="text"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleChange}
                          placeholder="Enter customer name"
                          className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          name="product"
                          value={formData.product}
                          onChange={handleChange}
                          placeholder="Enter product name"
                          className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date Information */}
                  <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-4">📅 Sale Date</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sale Date
                      </label>
                      <input
                        type="date"
                        name="saleDate"
                        value={formData.saleDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Quantity & Rate */}
                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                    <h3 className="text-lg font-semibold text-orange-800 mb-4">📊 Quantity & Pricing</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity (KG) *
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          placeholder="Enter quantity in KG"
                          className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rate per KG (₹) *
                        </label>
                        <input
                          type="number"
                          name="rate"
                          value={formData.rate}
                          onChange={handleChange}
                          placeholder="Enter rate per KG"
                          className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                      {/* Total Amount Display */}
                      {formData.quantity && formData.rate && (
                        <div className="bg-orange-100 p-4 rounded-lg border border-orange-300">
                          <p className="text-sm text-orange-800">Updated Total Amount:</p>
                          <p className="text-2xl font-bold text-orange-600">
                            ₹{(parseFloat(formData.quantity) * parseFloat(formData.rate)).toLocaleString('en-IN')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 Additional Notes</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Remarks (Optional)
                      </label>
                      <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        placeholder="Enter any additional notes..."
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => navigate('/sales-list')}
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
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Updating...
                    </div>
                  ) : (
                    '✅ Update Sale'
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

export default EditSales;
