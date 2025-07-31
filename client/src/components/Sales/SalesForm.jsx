// src/components/sales/SalesForm.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../layout/Layout';
import { useNavigate } from 'react-router-dom';

const SalesForm = () => {
  const [customers, setCustomers] = useState([]);
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

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/customers/all');
        setCustomers(res.data);
      } catch (err) {
        console.error('❌ Error fetching customers:', err);
        setError('Failed to load customers');
      }
    };
    fetchCustomers();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setSaleData({ ...saleData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { clientId, product, quantity, rate } = saleData;

    if (!clientId || !product || !quantity || !rate) {
      alert("Please fill all required fields.");
      return;
    }

    const selectedCustomer = customers.find(c => c._id === clientId);
    if (!selectedCustomer) {
      alert("Customer not found.");
      return;
    }

    const parsedQuantity = Number(quantity);
    const parsedRate = Number(rate);

    if (isNaN(parsedQuantity) || isNaN(parsedRate)) {
      alert("Quantity and Rate must be numbers.");
      return;
    }

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

      await axios.post('http://localhost:5000/api/sales/add', payload);
      alert('✅ Sale added successfully!');
      setSaleData({
        clientId: '',
        product: '',
        quantity: '',
        rate: '',
        saleDate: new Date().toISOString().split('T')[0],
        remarks: ''
      });
      navigate('/sales-list'); // Redirect to sales list after successful submission

    } catch (err) {
      console.error('❌ Failed to add sale:', err.response?.data || err.message);
      alert(`❌ Failed to add sale: ${err.response?.data?.message || "Something went wrong"}`);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-8 bg-white shadow p-6 rounded">
        <h2 className="text-xl font-semibold mb-4 text-sky-700">➕ Add New Sale</h2>
        <a href="/add-customer" className="text-sm text-blue-600 hover:underline">+ Add New Customer</a>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Dropdown */}
          <select
            name="clientId"
            value={saleData.clientId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Product */}
          <input
            type="text"
            name="product"
            value={saleData.product}
            onChange={handleChange}
            placeholder="Product"
            className="w-full border px-3 py-2 rounded"
            required
          />

          {/* Quantity */}
          <input
            type="number"
            name="quantity"
            value={saleData.quantity}
            onChange={handleChange}
            placeholder="Quantity (kg)"
            className="w-full border px-3 py-2 rounded"
            required
          />

          {/* Rate */}
          <input
            type="number"
            name="rate"
            value={saleData.rate}
            onChange={handleChange}
            placeholder="Rate ₹ per kg"
            className="w-full border px-3 py-2 rounded"
            required
          />

          {/* Sale Date */}
          <input
            type="date"
            name="saleDate"
            value={saleData.saleDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          {/* Remarks */}
          <textarea
            name="remarks"
            value={saleData.remarks}
            onChange={handleChange}
            placeholder="Remarks"
            className="w-full border px-3 py-2 rounded"
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${loading ? 'bg-sky-400 cursor-not-allowed' : 'bg-sky-700 hover:bg-sky-800'}`}
          >
            {loading ? 'Saving...' : '➕ Add Sale'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default SalesForm;
