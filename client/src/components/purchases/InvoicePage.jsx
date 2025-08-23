
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const InvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`https://cold-storage-system-1s.onrender.com/api/purchases/${id}`);
        console.log("✅ Invoice Data:", res.data);
        setPurchase(res.data.purchase);
      } catch (err) {
        console.error("❌ Invoice fetch error:", err.message);
        setError('Failed to load invoice');
        MySwal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to load invoice data',
          confirmButtonColor: '#0369a1'
        });
      } finally {
        setLoading(false);
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

    MySwal.fire({
      title: 'Generating PDF...',
      text: 'Please wait while we create your invoice PDF',
      allowOutsideClick: false,
      didOpen: () => {
        MySwal.showLoading();
      }
    });

    const printHiddenElements = input.querySelectorAll('.print\\:hidden');
    printHiddenElements.forEach(el => el.style.display = 'none');

    try {
      const canvas = await html2canvas(input, { 
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Purchase-Invoice-${purchase.lotNo || id.slice(-6).toUpperCase()}.pdf`);
      
      MySwal.fire({
        icon: 'success',
        title: 'PDF Downloaded!',
        text: 'Invoice has been saved successfully',
        confirmButtonColor: '#0369a1'
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
      MySwal.fire('Error', 'Failed to generate PDF.', 'error');
    } finally {
      printHiddenElements.forEach(el => el.style.display = '');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !purchase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <p className="text-xl text-red-600 mb-4">{error || 'Invoice not found'}</p>
          <button
            onClick={handleGoBack}
            className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const {
    purchaseDate,
    coldStorage,
    vehicleNo,
    lotNo,
    transport,
    farmerId,
    variety,
    quality,
    bags,
    weightPerBag,
    totalWeight,
    ratePerKg,
    amount,
    remarks
  } = purchase;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl border border-gray-200 rounded-2xl overflow-hidden">
        
        {/* Invoice Content */}
        <div id="invoice-content" className="p-6 sm:p-10">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start border-b-4 border-sky-600 pb-6 mb-8">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-sky-700 mb-2">KT TRADERS</h1>
              <p className="text-gray-600 font-medium">Cold Storage & Aloo Supply Experts</p>
              <p className="text-sm text-gray-500">Professional Purchase Management</p>
            </div>
            <div className="bg-sky-50 p-4 rounded-xl border border-sky-200">
              <div className="text-right">
                <p className="text-sm text-gray-600">Invoice Number</p>
                <p className="text-xl font-bold text-sky-700">INV-{lotNo || id.slice(-6).toUpperCase()}</p>
                <p className="text-sm text-gray-600 mt-2">Date</p>
                <p className="font-semibold">{new Date(purchaseDate).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Purchase Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Left Column - General Info */}
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">📍 Storage & Transport Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Cold Storage:</span>
                    <span className="font-semibold text-blue-600">{coldStorage || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Vehicle No:</span>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">{vehicleNo || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Lot No:</span>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">{lotNo || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Transport:</span>
                    <span className="font-semibold">{transport || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-4">👨‍🌾 Farmer Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Name:</span>
                    <span className="font-semibold text-green-600">{farmerId?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Phone:</span>
                    <span className="font-semibold">{farmerId?.phone || 'N/A'}</span>
                  </div>
                  {farmerId?.address && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Address:</span>
                      <span className="font-semibold text-right max-w-[200px]">{farmerId.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">🌾 Product Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Variety:</span>
                    <span className="font-semibold text-purple-600">{variety || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Quality:</span>
                    <span className="bg-purple-100 px-3 py-1 rounded-full text-sm font-semibold text-purple-700">
                      {quality || 'Standard'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Total Bags:</span>
                    <span className="font-bold text-xl text-purple-600">{bags || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Weight per Bag:</span>
                    <span className="font-semibold">{weightPerBag ? `${weightPerBag} kg` : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-800 mb-4">💰 Financial Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Total Weight:</span>
                    <span className="font-bold text-orange-600">{totalWeight ? `${totalWeight} kg` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Rate per KG:</span>
                    <span className="font-semibold">₹{ratePerKg || 'N/A'}</span>
                  </div>
                  <div className="border-t border-orange-300 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-orange-800">Total Amount:</span>
                      <span className="text-2xl font-bold text-orange-600">₹{amount ? amount.toLocaleString('en-IN') : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Table */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Purchase Summary</h3>
            <div className="overflow-x-auto bg-gray-50 rounded-xl border border-gray-200">
              <table className="w-full">
                <thead className="bg-sky-700 text-white">
                  <tr>
                    <th className="p-4 text-left">#</th>
                    <th className="p-4 text-left">Variety</th>
                    <th className="p-4 text-center">Bags</th>
                    <th className="p-4 text-center">Wt/Bag (KG)</th>
                    <th className="p-4 text-center">Total Wt (KG)</th>
                    <th className="p-4 text-center">Rate/KG (₹)</th>
                    <th className="p-4 text-center">Quality</th>
                    <th className="p-4 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 bg-white">
                    <td className="p-4 font-semibold">1</td>
                    <td className="p-4 font-medium text-sky-600">{variety || 'N/A'}</td>
                    <td className="p-4 text-center font-semibold">{bags || 'N/A'}</td>
                    <td className="p-4 text-center">{weightPerBag || 'N/A'}</td>
                    <td className="p-4 text-center font-bold text-purple-600">{totalWeight || 'N/A'}</td>
                    <td className="p-4 text-center">₹{ratePerKg || 'N/A'}</td>
                    <td className="p-4 text-center">
                      <span className="bg-green-100 px-2 py-1 rounded-full text-sm font-medium text-green-700">
                        {quality || 'Standard'}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-green-600 text-lg">
                      ₹{amount ? amount.toLocaleString('en-IN') : 'N/A'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Amount Highlight */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl text-white text-center mb-8">
            <p className="text-lg mb-2">Total Payable Amount</p>
            <p className="text-4xl font-bold">₹{amount ? amount.toLocaleString('en-IN') : 'N/A'}</p>
            <p className="text-sm mt-2 opacity-90">Including all charges</p>
          </div>

          {/* Remarks Section */}
          {remarks && (
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 mb-8">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">📝 Remarks</h3>
              <p className="text-gray-700">{remarks}</p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t-2 border-gray-200 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-600 mb-2">Thank you for your business!</p>
                <p className="text-sm text-gray-500">This invoice is computer-generated and doesn't require a signature.</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-4">Authorized Signature</p>
                <div className="border-b-2 border-gray-300 w-48 ml-auto mb-2"></div>
                <p className="text-sm text-gray-500">KT Traders Representative</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="print:hidden bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleGoBack}
              className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              ← Back to List
            </button>
            <button
              onClick={handlePrint}
              className="bg-sky-700 hover:bg-sky-800 text-white py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              🖨️ Print Invoice
            </button>
            <button
              onClick={downloadPDF}
              className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              📄 Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
