
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../layout/Layout';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import API_ENDPOINTS from '../../config/api';

const MySwal = withReactContent(Swal);

const SalesForm = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [saleData, setSaleData] = useState({
    clientId: '',
    product: '',
    quantity: '',
    rate: '',
    saleDate: new Date().toISOString().split('T')[0],
    remarks: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch customers and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers
        const customersRes = await axios.get(API_ENDPOINTS.CUSTOMERS);
        setCustomers(customersRes.data);

        // Fetch available products from stock
        const stockRes = await axios.get(API_ENDPOINTS.STOCK_ALL);
        const availableProducts = stockRes.data.map(stock => stock.productName);
        setProducts(availableProducts);
      } catch (err) {
        console.error('❌ Error fetching data:', err);
        setError('Failed to load data');
        MySwal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to load data',
          confirmButtonColor: '#0369a1'
        });
      }
    };
    fetchData();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setSaleData({ ...saleData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { clientId, product, quantity, rate } = saleData;

    if (!clientId || !product || !quantity || !rate) {
      MySwal.fire({
        icon: 'warning',
        title: 'Missing Information!',
        text: 'Please fill all required fields.',
        confirmButtonColor: '#0369a1'
      });
      return;
    }

    const selectedCustomer = customers.find(c => c._id === clientId);
    if (!selectedCustomer) {
      MySwal.fire({
        icon: 'error',
        title: 'Customer Not Found!',
        text: 'Selected customer is not valid.',
        confirmButtonColor: '#0369a1'
      });
      return;
    }

    const parsedQuantity = Number(quantity);
    const parsedRate = Number(rate);

    if (isNaN(parsedQuantity) || isNaN(parsedRate)) {
      MySwal.fire({
        icon: 'warning',
        title: 'Invalid Input!',
        text: 'Quantity and Rate must be valid numbers.',
        confirmButtonColor: '#0369a1'
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        clientId,
        customerName: selectedCustomer.name,
        product,
        quantity: parsedQuantity,
        rate: parsedRate,
        saleDate: saleData.saleDate,
        remarks: saleData.remarks
      };

      console.log("🟢 Submitting Sale Data:", payload);

      await axios.post(API_ENDPOINTS.SALES_ADD, payload);
      
      MySwal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Sale added successfully!',
        confirmButtonColor: '#0369a1'
      }).then(() => {
        setSaleData({
          clientId: '',
          product: '',
          quantity: '',
          rate: '',
          saleDate: new Date().toISOString().split('T')[0],
          remarks: ''
        });
        navigate('/sales-list');
      });

    } catch (err) {
      console.error('❌ Failed to add sale:', err.response?.data || err.message);
      MySwal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Failed to add sale: ${err.response?.data?.message || "Something went wrong"}`,
        confirmButtonColor: '#0369a1'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2">
              💰 Sales Entry Form
            </h1>
            <p className="text-gray-600">Add new sale record to your system</p>
          </div>

          {/* Quick Link */}
          <div className="mb-6 text-center">
            <a 
              href="/add-customer" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              👥 Add New Customer
            </a>
          </div>

          {/* Main Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-green-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">📝 Sale Information</h2>
              <p className="text-green-100">Please fill in all the required details</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Customer Selection */}
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">👥 Customer Details</h3>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Customer *
                    </label>
                    <select
                      name="clientId"
                      value={saleData.clientId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">Choose a customer...</option>
                      {customers.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name} - {c.phone || 'No phone'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Product Details */}
                  <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-4">🌾 Product Information</h3>
                    <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <select
                        name="product"
                        value={saleData.product}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        required
                      >
                        <option value="">Select a product...</option>
                        {products.map((product, index) => (
                          <option key={index} value={product}>
                            {product}
                          </option>
                        ))}
                      </select>
                    </div>
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
                          value={saleData.quantity}
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
                          value={saleData.rate}
                          onChange={handleChange}
                          placeholder="Enter rate per KG"
                          className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                      {/* Total Amount Display */}
                      {saleData.quantity && saleData.rate && (
                        <div className="bg-orange-100 p-4 rounded-lg border border-orange-300">
                          <p className="text-sm text-orange-800">Total Amount:</p>
                          <p className="text-2xl font-bold text-orange-600">
                            ₹{(parseFloat(saleData.quantity) * parseFloat(saleData.rate)).toLocaleString('en-IN')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date & Remarks */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Additional Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sale Date
                        </label>
                        <input
                          type="date"
                          name="saleDate"
                          value={saleData.saleDate}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Remarks (Optional)
                        </label>
                        <textarea
                          name="remarks"
                          value={saleData.remarks}
                          onChange={handleChange}
                          placeholder="Enter any additional notes..."
                          rows="4"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
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
                      Saving...
                    </div>
                  ) : (
                    '💰 Add Sale'
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

export default SalesForm;
