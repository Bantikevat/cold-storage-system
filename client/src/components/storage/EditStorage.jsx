import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../layout/Layout';
import axios from 'axios';

const EditStorage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    farmerId: '',
    product: '',
    quantity: '',
    room: '',
    rate: '',
    storageDate: '',
    outDate: '',
    remarks: ''
  });

  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    // 🔹 Fetch Storage Entry
    axios.get(`http://localhost:5000/api/storage/${id}`)
      .then(res => setForm(res.data))
      .catch(err => console.error('❌ Fetch error:', err));

    // 🔹 Fetch Farmer List
    axios.get('http://localhost:5000/api/farmers/all')
      .then(res => setFarmers(res.data))
      .catch(err => console.error('❌ Farmer fetch error:', err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/storage/update/${id}`, form);
      alert('✅ Updated successfully');
      navigate('/storage-list');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update entry');
    }
  };

  return (
    <Layout>
      <div className="mt-16 px-4 py-6 max-w-xl mx-auto bg-white shadow-md rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-yellow-700">✏️ Edit Storage Entry</h2>
          <Link to="/storage-list" className="text-sm text-blue-600 hover:underline">📋 Back to List</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <select name="farmerId" value={form.farmerId} onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">👤 Select Farmer</option>
            {farmers.map(f => (
              <option key={f._id} value={f._id}>{f.name} ({f.phone})</option>
            ))}
          </select>

          <input type="text" name="product" value={form.product} onChange={handleChange}
            placeholder="Product" className="w-full border p-2 rounded" required />

          <input type="number" name="quantity" value={form.quantity} onChange={handleChange}
            placeholder="Quantity (kg)" className="w-full border p-2 rounded" required />

          <input type="text" name="room" value={form.room} onChange={handleChange}
            placeholder="Room" className="w-full border p-2 rounded" />

          <input type="number" name="rate" value={form.rate} onChange={handleChange}
            placeholder="Rate ₹/kg/day" className="w-full border p-2 rounded" />

          <input type="date" name="storageDate" value={form.storageDate?.substring(0, 10)} onChange={handleChange}
            className="w-full border p-2 rounded" />

          <input type="date" name="outDate" value={form.outDate?.substring(0, 10)} onChange={handleChange}
            className="w-full border p-2 rounded" />

          <textarea name="remarks" value={form.remarks} onChange={handleChange}
            placeholder="Remarks" className="w-full border p-2 rounded" />

          <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded">
            ✅ Update
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditStorage;
