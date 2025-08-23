
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaDownload, FaPrint, FaEdit } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../layout/Layout';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalAmount: 0,
    totalQuantity: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchSales();
  }, [page, limit, sortBy, sortOrder]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://cold-storage-system-1s.onrender.com/api/sales/all?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${sortOrder}`);
      const salesData = res.data.sales || [];
      
      const formatted = salesData.map((s) => ({
        ...s,
        clientName: s.customerName,
        product: s.product,
        quantity: s.quantity,
        rate: s.rate,
        total: s.amount,
        date: new Date(s.saleDate).toLocaleDateString('en-IN'),
      }));

      setSales(formatted);
      setTotal(res.data.total);
      
      // Calculate stats
      const totalAmount = salesData.reduce((sum, s) => sum + (s.amount || 0), 0);
      const totalQuantity = salesData.reduce((sum, s) => sum + (s.quantity || 0), 0);
      
      setStats({
        totalSales: salesData.length,
        totalAmount,
        totalQuantity
      });

    } catch (err) {
      console.error('Error fetching sales:', err.message);
      MySwal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to fetch sales data',
        confirmButtonColor: '#0369a1'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const exportData = sales.map(s => ({
      'Sale Date': s.date,
      'Customer': s.clientName,
      'Product': s.product,
      'Quantity (KG)': s.quantity,
      'Rate (₹)': s.rate,
      'Total Amount (₹)': s.total
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales_Report');
    XLSX.writeFile(wb, `Sales_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    MySwal.fire({
      icon: 'success',
      title: 'Exported!',
      text: 'Sales report has been downloaded successfully',
      confirmButtonColor: '#0369a1'
    });
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: "This sale will be deleted permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://cold-storage-system-1s.onrender.com/api/sales/${id}`);
        setSales((prev) => prev.filter((s) => s._id !== id));
        MySwal.fire('Deleted!', 'Sale has been deleted successfully.', 'success');
        fetchSales(); // Refresh data
      } catch (err) {
        console.error('Delete error:', err);
        MySwal.fire('Error!', 'Failed to delete sale.', 'error');
      }
    }
  };

  const filteredSales = sales.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.clientName.toLowerCase().includes(query) ||
      item.product.toLowerCase().includes(query) ||
      item.date.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading sales data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2">
              📋 Sales Management
            </h1>
            <p className="text-gray-600">Complete sales tracking and management system</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sales</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.totalSales}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">📊</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-emerald-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600">₹{stats.totalAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 text-xl">💰</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-teal-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Quantity</p>
                  <p className="text-2xl sm:text-3xl font-bold text-teal-600">{stats.totalQuantity.toFixed(2)} KG</p>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-600 text-xl">⚖️</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">⚡ Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/sales-entry"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">➕</div>
                  <div className="font-semibold">Add Sale</div>
                </div>
              </Link>

              <Link
                to="/sales-report"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-semibold">Sales Report</div>
                </div>
              </Link>

              <Link
                to="/customer-list"
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="font-semibold">Customers</div>
                </div>
              </Link>

              <button
                onClick={fetchSales}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🔄</div>
                  <div className="font-semibold">Refresh</div>
                </div>
              </button>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by customer, product, or date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleExport} 
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <FaDownload /> Excel
                </button>
                <button 
                  onClick={() => window.print()} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <FaPrint /> Print
                </button>
              </div>
            </div>
          </div>

          {/* Sales Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">💰 Sales Records</h2>
            </div>
            
            {filteredSales.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    <tr>
                      <th className="text-left p-4 font-semibold whitespace-nowrap">Date</th>
                      <th className="text-left p-4 font-semibold whitespace-nowrap">Customer</th>
                      <th className="text-left p-4 font-semibold whitespace-nowrap">Product</th>
                      <th className="text-left p-4 font-semibold whitespace-nowrap">Qty (KG)</th>
                      <th className="text-left p-4 font-semibold whitespace-nowrap">Rate (₹)</th>
                      <th className="text-left p-4 font-semibold whitespace-nowrap">Amount (₹)</th>
                      <th className="text-left p-4 font-semibold whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map((item, index) => (
                      <tr key={item._id} className="border-b border-gray-100 hover:bg-green-50 transition-colors">
                        <td className="p-4 whitespace-nowrap font-medium">{item.date}</td>
                        <td className="p-4 font-medium text-green-600">{item.clientName}</td>
                        <td className="p-4">{item.product}</td>
                        <td className="p-4 text-center font-semibold">{item.quantity}</td>
                        <td className="p-4">₹{item.rate}</td>
                        <td className="p-4 font-bold text-green-600">₹{item.total.toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => window.open(`/sales-invoice/${item._id}`, '_blank')}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors text-sm flex items-center gap-1"
                              title="View Invoice"
                            >
                              📄 Invoice
                            </button>
                            <button
                              onClick={() => navigate(`/edit-sale/${item._id}`)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition-colors text-sm flex items-center gap-1"
                              title="Edit Sale"
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors text-sm flex items-center gap-1"
                              title="Delete Sale"
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
                <div className="text-gray-400 text-6xl mb-4">💰</div>
                <p className="text-xl text-gray-500 mb-4">No sales found</p>
                <p className="text-gray-400 mb-6">Add your first sale to get started!</p>
                <Link
                  to="/sales-entry"
                  className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
                >
                  ➕ Add First Sale
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SalesList;
