// src/components/sales/SalesList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaDownload, FaPrint, FaEdit } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();

  useEffect(() => {
    fetchSales();
  }, [page, limit, sortBy, sortOrder]);

  const fetchSales = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/sales/all?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${sortOrder}`);
      const formatted = res.data.sales.map((s) => ({
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
    } catch (err) {
      console.error('Error fetching sales:', err.message);
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(sales);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales');
    XLSX.writeFile(wb, 'Sales_Report.xlsx');
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/sales/${id}`);
        setSales((prev) => prev.filter((s) => s._id !== id));
        MySwal.fire('Deleted!', 'Sale has been deleted.', 'success');
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

  return (
    <Layout>
      <div className="mt-16 bg-gray-50 min-h-screen max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4 text-sky-700">📋 Sales List</h2>

        <div className="flex justify-between mb-4 gap-4">
          <input
            type="text"
            placeholder="Search client, product, date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button onClick={handleExport} className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
            <FaDownload className="inline mr-1" /> Excel
          </button>
          <button onClick={() => window.print()} className="bg-sky-600 text-white px-3 py-2 rounded hover:bg-sky-700">
            <FaPrint className="inline mr-1" /> Print
          </button>
        </div>

        <div className="overflow-auto rounded shadow bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-sky-100 text-sky-800">
              <tr>
                <th className="p-3">Client</th>
                <th className="p-3">Product</th>
                <th className="p-3">Qty (kg)</th>
                <th className="p-3">Rate (₹)</th>
                <th className="p-3">Total (₹)</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length > 0 ? (
                filteredSales.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-3">{item.clientName}</td>
                    <td className="p-3">{item.product}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">₹{item.rate}</td>
                    <td className="p-3 font-medium">₹{item.total}</td>
                    <td className="p-3">{item.date}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => navigate(`/edit-sale/${item._id}`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded"
                      >
                        <FaEdit className="inline" /> Edit
                      </button>
                      <button
                        onClick={() => window.open(`/sales-invoice/${item._id}`, '_blank')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded"
                      >
                        🧾 Invoice
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">No sales found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default SalesList;
