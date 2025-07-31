// src/components/sales/SalesInvoice.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const SalesInvoice = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);

  useEffect(() => {
   const fetchSale = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/sales/${id}`);
    console.log('Fetched Sale Data:', res.data); // Debugging line
    setSale(res.data);
  } catch (err) {
    console.error('Error fetching invoice:', err.message);
  }
};

    if (id) fetchSale();
  }, [id]);

  const downloadPDF = () => {
    const input = document.getElementById('invoice');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10);
      pdf.save(`Sales-Invoice-${id.slice(-6).toUpperCase()}.pdf`);
    });
  };

  if (!sale) return <div className="p-10">Loading...</div>;
const {
  customerName,
  product,
  quantity,
  rate,
  amount,
  remarks,
  saleDate
} = sale || {}; // Ensure sale is defined before destructuring


  return (
    <div id="invoice" className="max-w-4xl mx-auto bg-white shadow p-6 sm:p-10 mt-10 rounded-lg border-l-8 border-green-700 font-[Outfit]">
      <div className="flex flex-col sm:flex-row justify-between border-b-2 border-green-700 pb-4 mb-4">
        <div>
          <h2 className="text-3xl font-bold text-green-700">KT TRADERS</h2>
          <p className="text-sm text-gray-600">Cold Storage & Aloo Supply Experts</p>
        </div>
        <div className="text-sm mt-4 sm:mt-0 text-gray-700 text-right">
          <p><strong>Invoice No:</strong> SALE-{id.slice(-6).toUpperCase()}</p>
          <p><strong>Date:</strong> {new Date(saleDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mb-6 text-sm text-gray-700">
        <p><strong>Client:</strong> {customerName || 'N/A'}</p>
        <p><strong>Remarks:</strong> {remarks || 'N/A'}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Product</th>
              <th className="p-2">Quantity (kg)</th>
              <th className="p-2">Rate (₹)</th>
              <th className="p-2">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center text-gray-700">
              <td className="p-2">1</td>
              <td className="p-2">{product}</td>
              <td className="p-2">{quantity} kg</td>
              <td className="p-2">₹{rate}</td>
              <td className="p-2 font-semibold">₹{amount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-right text-lg font-semibold text-green-700 mt-6">
        Total Payable: ₹{amount}
      </div>

      <div className="mt-10 text-sm text-gray-600 border-t pt-6">
        <p>Thank you for your business!</p>
        <p>This invoice is computer-generated and doesn't require a signature.</p>
        <p className="mt-6 text-right text-gray-700">
          <strong>Authorized Signature: _______________________</strong>
        </p>
      </div>

      <div className="mt-10 text-center print:hidden flex flex-col gap-3">
        <button
          onClick={() => window.print()}
          className="bg-green-700 text-white py-2 px-6 rounded hover:bg-green-800"
        >
          🖨️ Print Invoice
        </button>
        <button
          onClick={downloadPDF}
          className="bg-indigo-700 text-white py-2 px-6 rounded hover:bg-indigo-800"
        >
          📄 Download PDF
        </button>
      </div>
    </div>
  );
};

export default SalesInvoice;
