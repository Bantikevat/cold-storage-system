// src/components/customer/CustomerList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../layout/Layout';
import { Link } from 'react-router-dom';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  // ✅ Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers/all');
      setCustomers(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch customers:', err);
    }
  };

  // ✅ Delete customer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`);
      alert('✅ Customer deleted');
      fetchCustomers(); // refresh
    } catch (err) {
      console.error('❌ Failed to delete customer:', err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <Layout>
      <div className="mt-16 px-4 py-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-sky-800">📋 Customer List</h1>
          <Link
            to="/add-customer"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          >
            ➕ Add Customer
          </Link>
        </div>

        <div className="overflow-auto bg-white shadow rounded">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-sky-100 text-sky-800">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((c, i) => (
                  <tr key={c._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3">{c.name}</td>
                    <td className="p-3">{c.phone || 'N/A'}</td>
                    <td className="p-3">{c.email || 'N/A'}</td>
                    <td className="p-3">{c.address || 'N/A'}</td>
                    <td className="p-3 flex gap-2">
                      <Link
                        to={`/edit-customer/${c._id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No customers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerList;
