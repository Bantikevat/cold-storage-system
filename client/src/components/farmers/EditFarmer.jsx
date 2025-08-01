// src/components/farmers/EditFarmer.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../layout/Layout'; // Assuming you have a Layout component
import Swal from 'sweetalert2'; // For confirmation dialog
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const EditFarmer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', aadhaar: '', email: '',
    // preferredRoom removed
  });
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [submitting, setSubmitting] = useState(false); // Loading state for form submission
  const [error, setError] = useState(''); // Error state

  useEffect(() => {
    const fetchFarmer = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`https://cold-storage-system.onrender.com/api/farmers/${id}`);
        setFormData(res.data);
      } catch (err) {
        console.error('Error fetching farmer:', err.message);
        setError('Failed to fetch farmer data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFarmer();
  }, [id]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await axios.put(`https://cold-storage-system.onrender.com/api/farmers/update/${id}`, formData);
      MySwal.fire('Updated!', 'Farmer details updated successfully.', 'success');
      navigate('/farmers'); // Navigate back to farmer list
    } catch (err) {
      console.error('Error updating farmer:', err.message);
      setError(`Failed to update farmer: ${err.response?.data?.message || err.message}`);
      MySwal.fire('Error!', `Failed to update farmer: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Layout><p className="text-center mt-10">Loading farmer data...</p></Layout>;
  if (error) return <Layout><p className="text-center mt-10 text-red-600">{error}</p></Layout>;
  if (!formData.name && !loading) return <Layout><p className="text-center mt-10 text-gray-600">Farmer not found or data could not be loaded.</p></Layout>;


  return (
    <Layout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen"> {/* Added padding and background */}
        <h2 className="text-2xl font-bold mb-6 text-gray-700">✏️ Edit Farmer</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar</label>
              <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            {/* preferredRoom field removed */}
          </div>
          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          <div className="mt-6 text-right">
            <button type="submit" disabled={submitting} className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {submitting ? 'Updating...' : 'Update Farmer'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditFarmer;
