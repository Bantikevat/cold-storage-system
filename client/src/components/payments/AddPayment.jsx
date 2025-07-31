// src/components/payments/AddPayment.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../layout/Layout'; // Adjust path
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const AddPayment = () => {
  const { farmerId } = useParams();
  const navigate = useNavigate();
  const [farmerName, setFarmerName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to current date
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFarmerName = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/farmers/${farmerId}`);
        setFarmerName(res.data.name);
      } catch (err) {
        console.error('Error fetching farmer name:', err.message);
        MySwal.fire('Error', 'Failed to fetch farmer details.', 'error');
        navigate('/farmers'); // Redirect if farmer not found
      }
    };
    if (farmerId) {
      fetchFarmerName();
    } else {
      navigate('/farmers'); // Redirect if no farmerId in URL
    }
  }, [farmerId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/payments/add', {
        farmerId,
        amount: Number(amount),
        date,
        remarks,
      });
      MySwal.fire('Success', 'Payment added successfully!', 'success');
      navigate(`/ledger/${farmerId}`); // Navigate back to ledger
    } catch (error) {
      console.error('Error adding payment:', error.message);
      MySwal.fire('Error', `Failed to add payment: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">💸 Add Payment for {farmerName}</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount (₹):</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">Remarks (optional):</label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Saving...' : '➕ Save Payment'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddPayment;
