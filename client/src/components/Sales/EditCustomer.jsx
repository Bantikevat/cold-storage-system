// src/components/customer/EditCustomer.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';

const EditCustomer = () => {
  const { id } = useParams(); // Get customer ID from URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  // 🔹 Fetch customer by ID
  const fetchCustomer = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/customers/${id}`);
      setForm(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch customer:', err);
    }
  };

  // 🔹 Load customer on mount
  useEffect(() => {
    fetchCustomer();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/customers/${id}`, form);
      alert('✅ Customer updated successfully!');
      navigate('/customer-list');
    } catch (err) {
      console.error('❌ Failed to update customer:', err);
      alert('❌ Failed to update customer');
    }
  };

  return (
    <Layout>
      <div className="mt-16 px-4 py-6 max-w-xl mx-auto bg-white shadow-md rounded-md">
        <h2 className="text-lg sm:text-xl font-semibold text-sky-700 mb-4">✏️ Edit Customer</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Customer Name"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full border px-3 py-2 rounded"
            rows={3}
          />

          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded w-full"
          >
            💾 Save Changes
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditCustomer;
