
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../layout/Layout';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [customers, searchTerm]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('https://cold-storage-system.onrender.com/api/customers/all');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      MySwal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to fetch customers',
        confirmButtonColor: '#0369a1'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId, customerName) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: `Delete customer: ${customerName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://cold-storage-system.onrender.com/api/customers/delete/${customerId}`);
        MySwal.fire('Deleted!', 'Customer has been deleted.', 'success');
        fetchCustomers(); // Refresh the list
      } catch (error) {
        MySwal.fire('Error!', 'Failed to delete customer.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <span className="ml-4 text-lg text-gray-600">Loading Customers...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              👥 Customer Management
            </h1>
            <p className="text-gray-600">Manage all your customers efficiently</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-3xl font-bold text-blue-600">{customers.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">👥</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Customers</p>
                  <p className="text-3xl font-bold text-green-600">{customers.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">✅</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New This Month</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {customers.filter(c => new Date(c.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">📈</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Add Customer */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search customers by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
              <Link
                to="/add-customer"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                ➕ Add New Customer
              </Link>
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">👥 All Customers ({filteredCustomers.length})</h2>
            </div>
            
            {filteredCustomers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-700">#</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Phone</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Address</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Added Date</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer, index) => (
                      <tr key={customer._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-semibold text-gray-600">{index + 1}</td>
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{customer.name}</div>
                        </td>
                        <td className="p-4">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {customer.phone}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{customer.email}</td>
                        <td className="p-4 text-gray-600 max-w-xs truncate">{customer.address}</td>
                        <td className="p-4 text-gray-600">
                          {new Date(customer.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Link
                              to={`/edit-customer/${customer._id}`}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition-colors text-sm flex items-center gap-1"
                              title="Edit Customer"
                            >
                              ✏️ Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(customer._id, customer.name)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors text-sm flex items-center gap-1"
                              title="Delete Customer"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <p className="text-xl text-gray-500 mb-4">
                  {searchTerm ? 'No customers found matching your search' : 'No customers found'}
                </p>
                <p className="text-gray-400 mb-6">Add your first customer to get started!</p>
                <Link
                  to="/add-customer"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                >
                  ➕ Add First Customer
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerList;
