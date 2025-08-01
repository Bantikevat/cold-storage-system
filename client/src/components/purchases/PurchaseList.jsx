// ✅ src/components/purchases/PurchaseList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaDownload, FaPrint, FaEdit, FaTrash, FaSortUp, FaSortDown } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const PurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('');
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Sorting states
  const [sortBy, setSortBy] = useState('purchaseDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const navigate = useNavigate();

  useEffect(() => {
    fetchPurchases();
    fetchFarmers();
  }, [page, limit, sortBy, sortOrder, searchQuery, fromDate, toDate, selectedFarmer, selectedQuality]); // Re-fetch on filter/pagination/sort changes

  const fetchPurchases = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`https://cold-storage-system.onrender.com/api/purchases/all`, {
        params: {
          page: page,
          limit: limit,
          sortBy: sortBy,
          sortOrder: sortOrder,
          search: searchQuery,
          farmerId: selectedFarmer,
          quality: selectedQuality,
          fromDate: fromDate,
          toDate: toDate,
        },
      });
      setPurchases(res.data.purchases);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching purchases:', err.message);
      setError('Failed to fetch purchases. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmers = async () => {
    try {
      const res = await axios.get('https://cold-storage-system.onrender.com/api/farmers/all?limit=1000'); // Fetch all farmers for filter dropdown
      setFarmers(res.data.farmers);
    } catch (err) {
      console.error('Error fetching farmers for filter:', err.message);
    }
  };

  const handleExport = () => {
    const dataToExport = purchases.map(item => ({
      'Farmer Name': item.farmerId?.name || 'N/A',
      'Purchase Date': new Date(item.purchaseDate).toLocaleDateString('en-IN'),
      'Variety': item.variety,
      'Bags': item.bags,
      'Weight per Bag (KG)': item.weightPerBag,
      'Total Weight (KG)': item.totalWeight,
      'Rate per KG (₹)': item.ratePerKg,
      'Amount (₹)': item.amount,
      'Quality': item.quality,
      'Remarks': item.remarks,
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Purchases');
    XLSX.writeFile(wb, 'Purchase_Report.xlsx');
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this! This will delete the purchase permanently.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://cold-storage-system.onrender.com/api/purchases/${id}`);
        MySwal.fire('Deleted!', 'Purchase has been deleted.', 'success');
        fetchPurchases(); // Refresh the list
      } catch (err) {
        console.error('Delete error:', err);
        MySwal.fire('Error!', `Failed to delete purchase: ${err.response?.data?.message || err.message}`, 'error');
      }
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setPage(1); // Reset to first page on sort change
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-700">📄 Purchase List</h2>
          <div className="flex items-center border rounded px-2 py-1 bg-white shadow w-full md:w-80">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search farmer, variety..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="outline-none w-full text-sm px-1"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6 bg-white p-4 rounded shadow">
          <div>
            <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">From Date:</label>
            <input type="date" id="fromDate" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">To Date:</label>
            <input type="date" id="toDate" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label htmlFor="selectedFarmer" className="block text-sm font-medium text-gray-700 mb-1">Select Farmer:</label>
            <select id="selectedFarmer" value={selectedFarmer} onChange={(e) => { setSelectedFarmer(e.target.value); setPage(1); }} className="border p-2 rounded w-full">
              <option value="">All Farmers</option>
              {farmers.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="selectedQuality" className="block text-sm font-medium text-gray-700 mb-1">Select Quality:</label>
            <select id="selectedQuality" value={selectedQuality} onChange={(e) => { setSelectedQuality(e.target.value); setPage(1); }} className="border p-2 rounded w-full">
              <option value="">All Quality</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button onClick={handleExport} className="bg-green-600 text-white px-2 py-2 rounded hover:bg-green-600 w-full">
              <FaDownload className="inline mr-1" /> Excel
            </button>
            <button onClick={() => window.print()} className="bg-sky-600 text-white px-3 py-2 rounded hover:bg-sky-700 w-full">
              <FaPrint className="inline mr-1" /> Print
            </button>
          </div>
        </div>

        {loading && <p className="text-center text-gray-600">Loading purchases...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto rounded shadow bg-white">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-sky-100 text-sky-800">
                  <tr>
                    <th className="p-3 whitespace-nowrap cursor-pointer" onClick={() => handleSort('purchaseDate')}>
                      Date {sortBy === 'purchaseDate' && (sortOrder === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />)}
                    </th>
                    <th className="p-3 whitespace-nowrap cursor-pointer" onClick={() => handleSort('farmerId')}>
                      Farmer {sortBy === 'farmerId' && (sortOrder === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />)}
                    </th>
                    <th className="p-3 whitespace-nowrap cursor-pointer" onClick={() => handleSort('variety')}>
                      Variety {sortBy === 'variety' && (sortOrder === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />)}
                    </th>
                    <th className="p-3 whitespace-nowrap">Bags</th>
                    <th className="p-3 whitespace-nowrap">Wt/Bag (KG)</th>
                    <th className="p-3 whitespace-nowrap cursor-pointer" onClick={() => handleSort('totalWeight')}>
                      Total Wt (KG) {sortBy === 'totalWeight' && (sortOrder === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />)}
                    </th>
                    <th className="p-3 whitespace-nowrap cursor-pointer" onClick={() => handleSort('ratePerKg')}>
                      Rate/KG (₹) {sortBy === 'ratePerKg' && (sortOrder === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />)}
                    </th>
                    <th className="p-3 whitespace-nowrap cursor-pointer" onClick={() => handleSort('amount')}>
                      Amount (₹) {sortBy === 'amount' && (sortOrder === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />)}
                    </th>
                    <th className="p-3 whitespace-nowrap">Quality</th>
                    <th className="p-3 whitespace-nowrap">Remarks</th>
                    <th className="p-3 whitespace-nowrap text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.length > 0 ? (
                    purchases.map((item) => (
                      <tr key={item._id} className="border-t hover:bg-gray-50">
                        <td className="p-3 whitespace-nowrap">{new Date(item.purchaseDate).toLocaleDateString('en-IN')}</td>
                        <td className="p-3 whitespace-nowrap">{item.farmerId?.name || 'N/A'}</td>
                        <td className="p-3 whitespace-nowrap">{item.variety}</td>
                        <td className="p-3 whitespace-nowrap">{item.bags}</td>
                        <td className="p-3 whitespace-nowrap">{item.weightPerBag}</td>
                        <td className="p-3 whitespace-nowrap">{item.totalWeight}</td>
                        <td className="p-3 whitespace-nowrap">₹{item.ratePerKg}</td>
                        <td className="p-3 whitespace-nowrap font-medium">₹{item.amount}</td>
                        <td className="p-3 whitespace-nowrap">{item.quality}</td>
                        <td className="p-3 whitespace-nowrap">{item.remarks || '—'}</td>
                        <td className="p-3 whitespace-nowrap flex justify-center gap-2">
                          <button
                            onClick={() => navigate(`/edit-purchase/${item._id}`)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-2 py-1 rounded"
                          >
                            <FaEdit className="inline" /> Edit
                          </button>
                          <button
                            onClick={() => window.open(`/invoice/${item._id}`, '_blank')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-2 py-1 rounded"
                          >
                            🧾 Invoice
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
                          >
                            <FaTrash className="inline" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="p-4 text-center text-gray-500">No purchases found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 p-2 bg-white rounded shadow">
              <div>
                <label htmlFor="limit" className="text-sm text-gray-700 mr-2">Items per page:</label>
                <select
                  id="limit"
                  value={limit}
                  onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}
                  className="border rounded p-1 text-sm"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {page} of {totalPages} ({total} purchases total)
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default PurchaseList;
