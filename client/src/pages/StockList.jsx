import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StockFilter from './StockFilter'; // Import the filter component
import Layout from '../components/layout/Layout';

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ productName: '', minStock: '', maxStock: '' });

  const fetchStocks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stock');
      setStocks(res.data);
    } catch (err) {
      setError('Failed to fetch stock data');
      console.error('Failed to fetch stock:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  if (loading) return <p className="p-4 text-center">🔄 Loading stock data...</p>;

  const filteredStocks = stocks.filter(stock => {
    return (
      (filters.productName ? stock.productName.toLowerCase().includes(filters.productName.toLowerCase()) : true) &&
      (filters.minStock ? stock.currentStock >= Number(filters.minStock) : true) &&
      (filters.maxStock ? stock.currentStock <= Number(filters.maxStock) : true)
    );
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/stock/delete/${id}`);
        fetchStocks(); // Refresh the stock list
      } catch (err) {
        setError('Failed to delete stock');
        console.error('Failed to delete stock:', err);
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-sky-700">📦 Stock Management</h2>
        <StockFilter onFilterChange={handleFilterChange} /> {/* Add filter component */}
        {error && <p className="text-red-600">{error}</p>}
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-sky-100 text-sky-800">
            <tr>
              <th className="border p-2">Product</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Current</th>
              <th className="border p-2">Min Alert</th>
              <th className="border p-2">Updated</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">No stock available</td>
              </tr>
            ) : (
              filteredStocks.map(stock => (
                <tr key={stock._id} className="border-t hover:bg-gray-50 transition">
                  <td className="border p-2">{stock.productName}</td>
                  <td className="border p-2">{stock.description || '-'}</td>
                  <td className={`border p-2 font-bold ${stock.currentStock < stock.minStockAlert ? 'text-red-600' : ''}`}>
                    {stock.currentStock}
                  </td>
                  <td className="border p-2">{stock.minStockAlert}</td>
                  <td className="border p-2">{new Date(stock.lastUpdated).toLocaleDateString()}</td>
                  <td className="border p-2">
                    <Link to={`/stock/edit/${stock._id}`} className="text-blue-600 hover:underline">Edit</Link>
                    <button onClick={() => handleDelete(stock._id)} className="text-red-600 hover:underline ml-2">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default StockList;
