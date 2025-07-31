// ✅ src/components/purchases/EditPurchase.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../layout/Layout';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const EditPurchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    farmerId: '',
    purchaseDate: '',
    variety: '',
    bags: '',
    weightPerBag: '',
    ratePerKg: '',
    quality: '',
    remarks: ''
  });
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch farmers list
        const farmersRes = await axios.get("http://localhost:5000/api/farmers/all?limit=1000");
        setFarmers(farmersRes.data.farmers);

        // Fetch purchase details
        const purchaseRes = await axios.get(`http://localhost:5000/api/purchases/${id}`);
        const purchaseData = purchaseRes.data.purchase;

        setFormData({
          farmerId: purchaseData.farmerId?._id || '',
          purchaseDate: purchaseData.purchaseDate ? new Date(purchaseData.purchaseDate).toISOString().split('T')[0] : '',
          variety: purchaseData.variety || '',
          bags: purchaseData.bags || '',
          weightPerBag: purchaseData.weightPerBag || '',
          ratePerKg: purchaseData.ratePerKg || '',
          quality: purchaseData.quality || '',
          remarks: purchaseData.remarks || ''
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load purchase details or farmers list.');
        MySwal.fire('Error', 'Failed to load purchase details.', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculate total weight and amount dynamically
  const totalWeight = (Number(formData.bags) * Number(formData.weightPerBag)).toFixed(2);
  const amount = (totalWeight * Number(formData.ratePerKg)).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      bags: Number(formData.bags),
      weightPerBag: Number(formData.weightPerBag),
      ratePerKg: Number(formData.ratePerKg),
      totalWeight: parseFloat(totalWeight),
      amount: parseFloat(amount),
    };

    try {
      await axios.put(`http://localhost:5000/api/purchases/${id}`, payload);
      MySwal.fire('Success', 'Purchase updated successfully!', 'success');
      navigate('/purchase-list');
    } catch (err) {
      console.error('Error updating purchase:', err.message);
      MySwal.fire('Error', `Failed to update purchase: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Layout><p className="p-10 text-center">Loading purchase details...</p></Layout>;
  if (error) return <Layout><p className="p-10 text-center text-red-600">{error}</p></Layout>;

  return (
    <Layout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">📝 Edit Purchase</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-3xl w-full mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Farmer Selection */}
            <div className="col-span-full md:col-span-1">
              <label htmlFor="farmerId" className="block text-sm font-medium text-gray-700 mb-1">Select Farmer:</label>
              <select
                id="farmerId"
                name="farmerId"
                value={formData.farmerId}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">Select Farmer</option>
                {farmers.map(farmer => (
                  <option key={farmer._id} value={farmer._id}>{farmer.name} ({farmer.phone})</option>
                ))}
              </select>
            </div>

            {/* Purchase Date */}
            <div className="col-span-full md:col-span-1">
              <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-1">Purchase Date:</label>
              <input
                type="date"
                id="purchaseDate"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            {/* Variety */}
            <div className="col-span-full md:col-span-1">
              <label htmlFor="variety" className="block text-sm font-medium text-gray-700 mb-1">Variety (e.g., Kufri Jyoti):</label>
              <input
                type="text"
                id="variety"
                name="variety"
                placeholder="Variety"
                value={formData.variety}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            {/* Bags */}
            <div className="col-span-full md:col-span-1">
              <label htmlFor="bags" className="block text-sm font-medium text-gray-700 mb-1">Total Bags:</label>
              <input
                type="number"
                id="bags"
                name="bags"
                placeholder="Total Bags"
                value={formData.bags}
                onChange={handleChange}
                required
                min="1"
                className="border p-2 rounded w-full focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            {/* Weight per Bag */}
            <div className="col-span-full md:col-span-1">
              <label htmlFor="weightPerBag" className="block text-sm font-medium text-gray-700 mb-1">Weight per Bag (KG):</label>
              <input
                type="number"
                id="weightPerBag"
                name="weightPerBag"
                placeholder="Weight per Bag (KG)"
                value={formData.weightPerBag}
                onChange={handleChange}
                required
                min="0.01"
                step="0.01"
                className="border p-2 rounded w-full focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            {/* Rate per Kg */}
            <div className="col-span-full md:col-span-1">
              <label htmlFor="ratePerKg" className="block text-sm font-medium text-gray-700 mb-1">Rate per KG (₹):</label>
              <input
                type="number"
                id="ratePerKg"
                name="ratePerKg"
                placeholder="Rate per KG (₹)"
                value={formData.ratePerKg}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="border p-2 rounded w-full focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            {/* Quality */}
            <div className="col-span-full md:col-span-1">
              <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-1">Select Quality:</label>
              <select
                id="quality"
                name="quality"
                value={formData.quality}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Remarks */}
            <div className="col-span-full">
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">Remarks (optional):</label>
              <textarea
                id="remarks"
                name="remarks"
                placeholder="Remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="3"
                className="border p-2 rounded w-full focus:ring-sky-500 focus:border-sky-500"
              ></textarea>
            </div>
          </div>

          {/* Calculated Values Display */}
          <div className="mt-6 p-4 bg-gray-100 rounded border border-gray-200 text-gray-700">
            <p className="text-lg font-semibold">Summary:</p>
            <p>Total Weight: <strong>{totalWeight} kg</strong></p>
            <p>Total Amount: <strong>₹{amount}</strong></p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`mt-6 bg-sky-700 hover:bg-sky-800 text-white py-2 px-6 rounded transition ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Updating...' : '✅ Update Purchase'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditPurchase;
