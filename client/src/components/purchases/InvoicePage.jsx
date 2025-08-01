import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const InvoicePage = () => {
  const { id } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  const fetchInvoice = async () => {
    try {
      const res = await axios.get(`https://cold-storage-system.onrender.com/api/purchases/${id}`);
      setPurchase(res.data.purchase); // ⚠️ Might be undefined if backend response doesn't have .purchase

      console.log("📦 Invoice Response:", res.data);
      setLoading(false);
      
    } catch (err) {
      console.error("❌ Invoice fetch error:", err.message);
    }
  };
  fetchInvoice();
}, [id]);


  const downloadPDF = async () => {
    const input = document.getElementById('invoice-content');
    if (!input) {
      MySwal.fire('Error', 'Invoice content not found for PDF generation.', 'error');
      return;
    }

    const printHiddenElements = input.querySelectorAll('.print\\:hidden');
    printHiddenElements.forEach(el => el.style.display = 'none');

    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Purchase-Invoice-${id.slice(-6).toUpperCase()}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      MySwal.fire('Error', 'Failed to generate PDF.', 'error');
    } finally {
      printHiddenElements.forEach(el => el.style.display = '');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading invoice...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!purchase) return <div className="p-10 text-center">Invoice not found.</div>;

  const {
    farmerId,
    variety,
    bags,
    weightPerBag,
    totalWeight,
    ratePerKg,
    amount,
    quality,
    remarks,
    purchaseDate
  } = purchase;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow p-6 sm:p-10 mt-10 rounded-lg border-l-8 border-sky-700 font-[Outfit]">
      <div id="invoice-content">
        <div className="flex flex-col sm:flex-row justify-between border-b-2 border-sky-700 pb-4 mb-4">
          <div>
            <h2 className="text-3xl font-bold text-sky-700">KT TRADERS</h2>
            <p className="text-sm text-gray-600">Cold Storage & Aloo Supply Experts</p>
          </div>
          <div className="text-sm mt-4 sm:mt-0 text-gray-700 text-right">
            <p><strong>Invoice No:</strong> INV-{id.slice(-6).toUpperCase()}</p>
            <p><strong>Date:</strong> {new Date(purchaseDate).toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        <div className="mb-6 text-sm text-gray-700">
          <p><strong>Farmer:</strong> {farmerId?.name || 'N/A'}</p>
          <p><strong>Phone:</strong> {farmerId?.phone || 'N/A'}</p>
          <p><strong>Remarks:</strong> {remarks || 'N/A'}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-sky-700 text-white">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Variety</th>
                <th className="p-2">Bags</th>
                <th className="p-2">Wt/Bag</th>
                <th className="p-2">Total Wt</th>
                <th className="p-2">Rate/KG</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Quality</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center text-gray-700">
                <td className="p-2">1</td>
                <td className="p-2">{variety || 'N/A'}</td>
                <td className="p-2">{bags || 'N/A'}</td>
                <td className="p-2">{weightPerBag ? `${weightPerBag} kg` : 'N/A'}</td>
                <td className="p-2">{totalWeight ? `${totalWeight} kg` : 'N/A'}</td>
                <td className="p-2">₹{ratePerKg || 'N/A'}</td>
                <td className="p-2 font-semibold">₹{amount || 'N/A'}</td>
                <td className="p-2">{quality || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-right text-lg font-semibold text-sky-700 mt-6">
          Total Payable: ₹{amount || 'N/A'}
        </div>

        <div className="mt-10 text-sm text-gray-600 border-t pt-6">
          <p>Thank you for your business!</p>
          <p>This invoice is computer-generated and doesn't require a signature.</p>
          <p className="mt-6 text-right text-gray-700">
            <strong>Authorized Signature: _______________________</strong>
          </p>
        </div>
      </div>

      <div className="mt-10 text-center print:hidden flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => window.print()}
          className="bg-sky-700 text-white py-2 px-6 rounded hover:bg-sky-800 transition"
        >
          🖨️ Print Invoice
        </button>
        <button
          onClick={downloadPDF}
          className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition"
        >
          📄 Download PDF
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
