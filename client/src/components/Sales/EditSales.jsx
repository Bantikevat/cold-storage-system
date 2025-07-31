// src/components/sales/EditSales.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../layout/Layout';

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

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/sales/${id}`);
        console.log('Fetched Sale Data for Edit:', res.data); // Debugging line
        setFormData({
          customerName: res.data.customerName || '',
          product: res.data.product || '',
          quantity: res.data.quantity || '',
          rate: res.data.rate || '',
          saleDate: res.data.saleDate ? new Date(res.data.saleDate).toISOString().split('T')[0] : '',
          remarks: res.data.remarks || ''
        });
      } catch (error) {
        console.error('Error fetching sale:', error);
        alert('❌ Error fetching sale data. Please try again.');
      }
    };

    if (id) fetchSale();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { quantity, rate } = formData;

    try {
      await axios.put(`http://localhost:5000/api/sales/${id}`, {
        ...formData,
        quantity: Number(quantity),
        rate: Number(rate),
        amount: Number(quantity) * Number(rate),
      });
      alert('✅ Sale updated successfully!');
      navigate('/sales-list');
    } catch (error) {
      console.error('Error updating sale:', error);
      alert('❌ Update failed. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-8 bg-white shadow p-6 rounded">
        <h2 className="text-xl font-semibold mb-4 text-sky-700">📝 Edit Sale</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Customer Name"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="text"
            name="product"
            value={formData.product}
            onChange={handleChange}
            placeholder="Product"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity (kg)"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="number"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            placeholder="Rate ₹ per kg"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="date"
            name="saleDate"
            value={formData.saleDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Remarks"
            className="w-full border px-3 py-2 rounded"
          ></textarea>

          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded w-full"
          >
            ✅ Update Sale
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditSales;
