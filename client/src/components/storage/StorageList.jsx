import React, { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StorageFilterBar from './StorageFilterBar';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import PrintViewModal from './PrintViewModal';

const StorageList = () => {
  const [storage, setStorage] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/storage/all')
      .then(res => setStorage(res.data))
      .catch(err => console.error('Storage fetch error:', err));
  }, []);

  const [filters, setFilters] = useState({
    farmer: '',
    product: '',
    status: '',
    fromDate: '',
    toDate: ''
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredStorage = storage.filter((item) => {
    const nameMatch = item.farmerId?.name.toLowerCase().includes(filters.farmer.toLowerCase());
    const productMatch = item.product.toLowerCase().includes(filters.product.toLowerCase());
    const statusMatch =
      filters.status === '' ||
      (filters.status === 'in' && !item.outDate) ||
      (filters.status === 'out' && item.outDate);

    const inDate = new Date(item.storageDate);
    const from = filters.fromDate ? new Date(filters.fromDate) : null;
    const to = filters.toDate ? new Date(filters.toDate) : null;

    const dateMatch = (!from || inDate >= from) && (!to || inDate <= to);

    return nameMatch && productMatch && statusMatch && dateMatch;
  });

  const calculateDays = (inDate, outDate) => {
    const start = new Date(inDate);
    const end = outDate ? new Date(outDate) : new Date();
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const summary = filteredStorage.reduce((acc, item) => {
    const days = calculateDays(item.storageDate, item.outDate);
    const total = (item.quantity || 0) * (item.rate || 0) * days;
    acc.totalQty += Number(item.quantity || 0);
    acc.totalIncome += total;
    acc.totalEntries += 1;
    return acc;
  }, { totalQty: 0, totalIncome: 0, totalEntries: 0 });

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredStorage);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Storage Data');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'storage_data.xlsx');
  };
  const [printEntry, setPrintEntry] = useState(null);
    const handlePrint = (entry) => {
        setPrintEntry(entry);
    };

  

  return (
    <Layout>
      <div className="mt-16 px-4 py-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h1 className="text-xl font-bold text-green-800">📦 Storage Entries</h1>
          <StorageFilterBar filters={filters} onChange={handleFilterChange} />
          <Link
            to="/add-storage"
            className="text-sm text-blue-600 hover:underline whitespace-nowrap"
          >
            ➕ Add New Entry
          </Link>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={handleExportExcel}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded shadow"
          >
            📤 Export Excel
          </button>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-green-100 text-green-800">
              <tr>
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Farmer</th>
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-left">Qty (kg)</th>
                <th className="p-2 text-left">In Date</th>
                <th className="p-2 text-left">Out Date</th>
                <th className="p-2 text-left">Room</th>
                <th className="p-2 text-left">Rate ₹</th>
                <th className="p-2 text-left">Days</th>
                <th className="p-2 text-left">Total ₹</th>
                <th className="p-2 text-left">Remarks</th>
                <th className="p-2 text-left">Actions</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {storage.length > 0 ? (
                filteredStorage.map((s, i) => {
                  const days = calculateDays(s.storageDate, s.outDate);
                  const total = (s.quantity || 0) * (s.rate || 0) * days;
                  const status = s.outDate ? 'Out' : 'In';

                  return (
                    <tr key={s._id} className="border-t hover:bg-gray-50">
                      <td className="p-2">{i + 1}</td>
                      <td className="p-2">{s.farmerId?.name || '-'}</td>
                      <td className="p-2">{s.product}</td>
                      <td className="p-2">{s.quantity}</td>
                      <td className="p-2">{new Date(s.storageDate).toLocaleDateString()}</td>
                      <td className="p-2">{s.outDate ? new Date(s.outDate).toLocaleDateString() : '—'}</td>
                      <td className="p-2">{s.room || '—'}</td>
                      <td className="p-2">{s.rate || 0}</td>
                      <td className="p-2">{days}</td>
                      <td className="p-2 font-semibold text-green-700">₹{total}</td>
                      <td className="p-2">{s.remarks || '-'}</td>
                      <td className="p-2 space-y-1 flex flex-col sm:flex-row gap-1">
                        <Link
                          to={`/edit-storage/${s._id}`}
                          className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        >
                          ✏️ Edit
                        </Link>
                        <button
  onClick={() => {
    if (window.confirm('❌ Delete this entry?')) {
      axios.delete(`http://localhost:5000/api/storage/${s._id}`)
        .then(() => {
          alert('✅ Deleted successfully');
          setStorage(prev => prev.filter(item => item._id !== s._id));
        })
        .catch(() => alert('❌ Delete failed'));
    }
  }}
  className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
>
  🗑️ Delete
</button>
                        <button
  onClick={() => setPrintEntry(s)}
  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
>
  🖨️ Print
</button>

                      </td>
                        <td className="p-2">
                            <span className={`px-2 py-1 rounded text-xs ${s.outDate ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {status}
                            </span>
                        </td>
                    </tr>
                    );
                }
                )
                ) : (
                <tr>
                  <td colSpan="13" className="p-4 text-center text-gray-500">
                    No storage entries found
                  </td>
                </tr>
                )}
            </tbody>
            </table>
            <div className="p-4 bg-gray-50">
                <h2 className="text-lg font-semibold text-green-800">Summary</h2>
                <p>Total Entries: {summary.totalEntries}</p>
                <p>Total Quantity: {summary.totalQty} kg</p>
                <p>Total Income: ₹{summary.totalIncome.toFixed(2)}</p>
            </div>
            </div>
        </div>
        <PrintViewModal entry={printEntry} onClose={() => setPrintEntry(null)} />

        </Layout>
    );
}
export default StorageList;