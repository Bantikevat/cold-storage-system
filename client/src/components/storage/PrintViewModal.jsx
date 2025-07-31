import React from 'react';

const PrintViewModal = ({ entry, onClose }) => {
  if (!entry) return null;

  const calculateDays = (inDate, outDate) => {
    const start = new Date(inDate);
    const end = outDate ? new Date(outDate) : new Date();
    const diff = Math.abs(end - start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const days = calculateDays(entry.storageDate, entry.outDate);
  const total = entry.quantity * entry.rate * days;

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center print:bg-white print:block">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl print:w-full print:shadow-none print:rounded-none font-sans text-gray-800">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-green-700">🧾 Invoice</h2>
            <p className="text-sm text-gray-600">Cold Storage Management System</p>
          </div>
          <div className="text-sm text-right space-y-1">
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Invoice #:</strong> {entry._id.slice(-6).toUpperCase()}</p>
          </div>
        </div>

        {/* Farmer Info */}
        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-700 mb-2">👤 Farmer Details</h3>
          <div className="text-sm space-y-1">
            <p><strong>Name:</strong> {entry.farmerId?.name}</p>
            <p><strong>Phone:</strong> {entry.farmerId?.phone}</p>
            <p><strong>Email:</strong> {entry.farmerId?.email || '—'}</p>
            <p><strong>Address:</strong> {entry.farmerId?.address || '—'}</p>
          </div>
        </div>

        {/* Storage Summary */}
        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-700 mb-2">📦 Storage Summary</h3>
          <table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
            <thead className="bg-green-100 text-green-800">
              <tr>
                {['Product', 'Qty (kg)', 'Rate ₹/kg/day', 'In Date', 'Out Date', 'Days', 'Total ₹'].map((th) => (
                  <th key={th} className="p-2 border">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="p-2 border">{entry.product}</td>
                <td className="p-2 border">{entry.quantity}</td>
                <td className="p-2 border">{entry.rate}</td>
                <td className="p-2 border">{new Date(entry.storageDate).toLocaleDateString()}</td>
                <td className="p-2 border">{entry.outDate ? new Date(entry.outDate).toLocaleDateString() : '—'}</td>
                <td className="p-2 border">{days}</td>
                <td className="p-2 border font-bold text-green-700">₹{total}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Remarks */}
        <div className="text-sm mb-4">
          <p><strong>Remarks:</strong> {entry.remarks || '—'}</p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4 print:hidden">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            ✖ Close
          </button>
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            🖨️ Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintViewModal;
