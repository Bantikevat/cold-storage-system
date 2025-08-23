import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FaDownload, FaPrint } from 'react-icons/fa';
import Layout from '../layout/Layout';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch purchase reports from backend
  const fetchReport = async () => {
    if (!fromDate || !toDate) {
      setReports([]);
      setFilteredReports([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('https://cold-storage-system-1s.onrender.com/api/purchases/report', {
        params: {
          fromDate,
          toDate,
        },
      });
      setReports(res.data);
      setFilteredReports(res.data);
    } catch (err) {
      console.error('Error fetching report:', err);
      setError('Failed to fetch report. Please try again.');
      MySwal.fire('Error', 'Failed to fetch report.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter reports by farmer name (client side)
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredReports(reports);
    } else {
      const filtered = reports.filter(r =>
        r.farmerId?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReports(filtered);
    }
  }, [searchTerm, reports]);

  // On component mount, set default dates
  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setDate(today.getDate() - 30);
    setFromDate(lastMonth.toISOString().split('T')[0]);
    setToDate(today.toISOString().split('T')[0]);
  }, []);

  // Fetch report when filters change
  useEffect(() => {
    fetchReport();
  }, [fromDate, toDate]);

  // Export filtered reports to Excel
  const handleExport = () => {
    if (filteredReports.length === 0) {
      MySwal.fire('Info', 'No data to export.', 'info');
      return;
    }
    const data = filteredReports.map((r) => ({
      Date: new Date(r.purchaseDate).toLocaleDateString('en-IN'),
      Farmer: r.farmerId?.name || 'N/A',
      Variety: r.variety,
      Bags: r.bags,
      'Weight per Bag (KG)': r.weightPerBag,
      'Total Weight (KG)': r.totalWeight,
      'Rate per KG (₹)': r.ratePerKg,
      'Amount (₹)': r.amount,
      Quality: r.quality,
      Remarks: r.remarks,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Purchase_Report');
    XLSX.writeFile(wb, 'Purchase_Report.xlsx');
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 bg-white min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">📊 Purchase Report</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-100 p-4 rounded shadow mb-6">
          <div>
            <label htmlFor="fromDate" className="block mb-1 text-sm font-medium text-gray-700">From Date:</label>
            <input
              type="date"
              id="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="toDate" className="block mb-1 text-sm font-medium text-gray-700">To Date:</label>
            <input
              type="date"
              id="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="search" className="block mb-1 text-sm font-medium text-gray-700">Search Farmer Name:</label>
            <input
              type="text"
              id="search"
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 mt-auto">
            <button
              onClick={handleExport}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-200"
            >
              <FaDownload className="inline mr-2" /> Excel
            </button>
            <button
              onClick={() => window.print()}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-200"
            >
              <FaPrint className="inline mr-2" /> Print
            </button>
          </div>
        </div>

        {/* Report Table */}
        {loading && <p className="text-center text-gray-600">Loading report...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Farmer</th>
                  <th className="p-3 text-left">Variety</th>
                  <th className="p-3 text-left">Bags</th>
                  <th className="p-3 text-left">Wt/Bag (KG)</th>
                  <th className="p-3 text-left">Total Wt (KG)</th>
                  <th className="p-3 text-left">Rate/KG (₹)</th>
                  <th className="p-3 text-left">Amount (₹)</th>
                  <th className="p-3 text-left">Quality</th>
                  <th className="p-3 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((r, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-3">{new Date(r.purchaseDate).toLocaleDateString('en-IN')}</td>
                      <td className="p-3">{r.farmerId?.name || 'N/A'}</td>
                      <td className="p-3">{r.variety}</td>
                      <td className="p-3">{r.bags}</td>
                      <td className="p-3">{r.weightPerBag}</td>
                      <td className="p-3">{r.totalWeight}</td>
                      <td className="p-3">₹{r.ratePerKg}</td>
                      <td className="p-3 font-semibold">₹{r.amount}</td>
                      <td className="p-3">{r.quality}</td>
                      <td className="p-3">{r.remarks || '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="p-4 text-center text-gray-500">No data found for the selected filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReportPage;
