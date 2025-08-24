// src/components/farmers/FarmerLedger.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Layout from '../layout/Layout'; // Adjust path
import '../../css/print.css'; // Ensure you have a print.css for print styles (optional, but good for print styling)
import API_ENDPOINTS from '../../config/api';

const FarmerLedger = () => {
  const { farmerId } = useParams();
  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    // Set default date range for the last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    setFromDate(thirtyDaysAgo.toISOString().split('T')[0]);
    setToDate(today.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (fromDate && toDate) { // Only fetch if dates are set
      fetchLedger();
    }
  }, [farmerId, fromDate, toDate]); // Re-fetch when farmerId or dates change

  const fetchLedger = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_ENDPOINTS.FARMERS_LEDGER}/${farmerId}`, {
        params: { from: fromDate, to: toDate }
      });
      setLedger(res.data);
    } catch (err) {
      console.error("Ledger fetch failed", err);
      setError(`Failed to load ledger: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = (inDate, outDate) => {
    const start = new Date(inDate);
    const end = outDate ? new Date(outDate) : new Date(); // If outDate is null, use current date
    const diff = Math.abs(end - start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)); // Days
  };

  const handleDownloadPDF = async () => {
    const input = document.getElementById('ledgerSection');
    // Temporarily hide print-specific elements for PDF generation
    const noPrintElements = input.querySelectorAll('.no-print');
    noPrintElements.forEach(el => el.style.display = 'none');

    const canvas = await html2canvas(input, { scale: 2 }); // Scale for better quality
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Add a header/footer if needed
    pdf.setFontSize(10);
    pdf.text(`Ledger for ${ledger?.farmer?.name || 'Farmer'} - Generated on ${new Date().toLocaleDateString()}`, 10, 10);

    pdf.addImage(imgData, 'PNG', 0, 20, pdfWidth, pdfHeight - 20); // Adjust Y position for header

    // Restore hidden elements
    noPrintElements.forEach(el => el.style.display = '');

    pdf.save(`${ledger?.farmer?.name || 'Farmer'}_ledger.pdf`);
  };

  if (loading) return <Layout><p className="text-center mt-10">Loading ledger...</p></Layout>;
  if (error) return <Layout><p className="text-center mt-10 text-red-600">{error}</p></Layout>;
  if (!ledger || !ledger.farmer) return <Layout><p className="text-center mt-10 text-gray-600">No ledger data found for this farmer.</p></Layout>;

  const { farmer, storageEntries, purchases, payments, summary } = ledger;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* 🔍 Filters & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 no-print">
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm">
              From:
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
                className="ml-2 border px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </label>
            <label className="text-sm">
              To:
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
                className="ml-2 border px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </label>
            <button onClick={fetchLedger}
              className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition">
              🔍 Apply Filter
            </button>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button onClick={() => window.print()}
              className="bg-gray-700 text-white px-4 py-1.5 rounded hover:bg-gray-800 transition">
              🖨️ Print
            </button>
            <button onClick={handleDownloadPDF}
              className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 transition">
              📄 Download PDF
            </button>
          </div>
        </div>

        {/* 🧾 Farmer Info */}
        <div id="ledgerSection" className="bg-white p-6 rounded shadow">
          <div className="border-b pb-4 mb-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-2">🧾 Ledger of: {farmer.name}</h2>
            <p className="text-gray-600 text-sm">📞 {farmer.phone || 'N/A'} &nbsp;&nbsp;|&nbsp;&nbsp; 📍 {farmer.address || 'N/A'}</p>
            <p className="text-gray-600 text-sm">📧 {farmer.email || 'N/A'} &nbsp;&nbsp;|&nbsp;&nbsp; 🆔 {farmer.aadhaar || 'N/A'}</p>
          </div>

          {/* 📊 Summary */}
          <div className="bg-gray-50 border border-gray-200 p-5 rounded-md mb-8">
            <h3 className="text-xl font-semibold mb-3">🔢 Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white rounded shadow p-3">💼 <strong>Total Storage Rent:</strong> ₹{summary.totalStorageRent || 0}</div>
              <div className="bg-white rounded shadow p-3">🛒 <strong>Total Purchases:</strong> ₹{summary.totalPurchase || 0}</div>
              <div className="bg-white rounded shadow p-3">💸 <strong>Total Paid:</strong> ₹{summary.totalPaid || 0}</div>
              <div className="bg-white rounded shadow p-3 text-red-600"><strong>Outstanding:</strong> ₹{summary.outstanding || 0}</div>
            </div>
          </div>

          {/* 🏬 Storage Entries */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">🏬 Storage Entries</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm text-left">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="p-3 border">Product</th>
                    <th className="p-3 border">Qty (kg)</th>
                    <th className="p-3 border">Rate (₹/kg/day)</th>
                    <th className="p-3 border">Date In</th>
                    <th className="p-3 border">Date Out</th>
                    <th className="p-3 border">Days</th>
                    <th className="p-3 border">Est. Rent</th>
                    <th className="p-3 border">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {storageEntries.length > 0 ? (
                    storageEntries.map((entry, index) => (
                      <tr key={index} className="even:bg-blue-50">
                        <td className="p-3 border">{entry.product}</td>
                        <td className="p-3 border">{entry.quantity}</td>
                        <td className="p-3 border">₹{entry.rate}</td>
                        <td className="p-3 border">{new Date(entry.storageDate).toLocaleDateString()}</td>
                        <td className="p-3 border">{entry.outDate ? new Date(entry.outDate).toLocaleDateString() : '—'}</td>
                        <td className="p-3 border">{calculateDays(entry.storageDate, entry.outDate)}</td>
                        <td className="p-3 border">₹{(entry.quantity * entry.rate * calculateDays(entry.storageDate, entry.outDate)).toFixed(2)}</td>
                        <td className="p-3 border">{entry.remarks || '—'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="8" className="text-center p-4 text-gray-500">No storage entries found for this period.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 🛒 Purchases */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">🛒 Purchases</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm text-left">
                <thead className="bg-green-100">
                  <tr>
                    <th className="p-3 border">Date</th>
                    <th className="p-3 border">Variety</th>
                    <th className="p-3 border">Qty (kg)</th>
                    <th className="p-3 border">Rate (₹/kg)</th>
                    <th className="p-3 border">Amount (₹)</th>
                    <th className="p-3 border">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.length > 0 ? (
                    purchases.map((item, index) => (
                      <tr key={index} className="even:bg-green-50">
                        <td className="p-3 border">{new Date(item.purchaseDate).toLocaleDateString()}</td>
                        <td className="p-3 border">{item.variety}</td>
                        <td className="p-3 border">{item.totalWeight}</td>
                        <td className="p-3 border">₹{item.ratePerKg}</td>
                        <td className="p-3 border">₹{item.amount}</td>
                        <td className="p-3 border">{item.remarks || '—'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" className="text-center p-4 text-gray-500">No purchases found for this period.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 💸 Payments */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">💸 Payments</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm text-left">
                <thead className="bg-yellow-100">
                  <tr>
                    <th className="p-3 border">Date</th>
                    <th className="p-3 border">Amount (₹)</th>
                    <th className="p-3 border">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length > 0 ? (
                    payments.map((p, index) => (
                      <tr key={index} className="even:bg-yellow-50">
                        <td className="p-3 border">{new Date(p.date).toLocaleDateString()}</td>
                        <td className="p-3 border">₹{p.amount}</td>
                        <td className="p-3 border">{p.remarks || '—'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="3" className="text-center p-4 text-gray-500">No payments found for this period.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FarmerLedger;
