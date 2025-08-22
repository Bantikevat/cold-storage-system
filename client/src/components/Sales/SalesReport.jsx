import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FaDownload, FaPrint } from 'react-icons/fa';
import Layout from '../layout/Layout';

const SalesReport = () => {
  const [sales, setSales] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');

  // ✅ Fetch Customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get('https://cold-storage-system.onrender.com/api/customers/all');
      console.log("Fetched Customers:", res.data);
      setCustomerList(res.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  // ✅ Fetch Sales Report
  const fetchReport = async () => {
    try {
      const res = await axios.get('https://cold-storage-system.onrender.com/api/sales/report', {
        params: {
          fromDate,
          toDate,
          customerId: selectedCustomer, // Ensure this is correct
        },
      });
      console.log("Fetched Sales:", res.data.data);
      setSales(res.data.data);
    } catch (err) {
      console.error('Failed to fetch report:', err);
    }
  };

  // Fetch report when dates or selected customer changes
  useEffect(() => {
    if (fromDate && toDate) {
      fetchReport();
    }
  }, [fromDate, toDate, selectedCustomer]);

  // ✅ Excel Export
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(sales.map((s) => ({
      Date: new Date(s.saleDate).toLocaleDateString('en-IN'),
      Customer: s.clientId?.name || s.customerName || '',
      Product: s.product,
      Quantity: s.quantity,
      Rate: s.rate,
      Total: s.quantity * s.rate,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales_Report');
    XLSX.writeFile(wb, 'Sales_Report.xlsx');
  };

  // ✅ Set default date + fetch customer
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFromDate(today);
    setToDate(today);
    fetchCustomers();
  }, []);

  return (
    <Layout>
      <div className="mt-16 px-4 py-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
        <h1 className="text-xl font-bold text-sky-800 mb-4">📊 Sales Report</h1>

        {/* 🔶 Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-white p-4 rounded shadow mb-6">
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border p-2 rounded" />
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border p-2 rounded" />
          <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} className="border p-2 rounded">
            <option value="">All Customers</option>
            { customerList.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>

              
            ))}
          </select>
          <button onClick={fetchReport } className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">
            🔍 Fetch Report

          </button>
          <div className="flex gap-2">
            <button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full">
              <FaDownload className="inline mr-1" /> Excel
            </button>
            <button onClick={() => window.print()} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded w-full">
              <FaPrint className="inline mr-1" /> Print
            </button>
          </div>
        </div>

        {/* 🔷 Table */}
        <div className="overflow-auto bg-white shadow rounded">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-sky-100 text-sky-800">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Qty (kg)</th>
                <th className="p-3 text-left">Rate (₹)</th>
                <th className="p-3 text-left">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {sales.length > 0 ? (
                sales.map((s, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-3">{new Date(s.saleDate).toLocaleDateString('en-IN')}</td>
                    <td className="p-3">{s.clientId?.name || s.customerName || 'N/A'}</td>
                    <td className="p-3">{s.product}</td>
                    <td className="p-3">{s.quantity}</td>
                    <td className="p-3">₹{s.rate}</td>
                    <td className="p-3 font-semibold">₹{s.quantity * s.rate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default SalesReport;
