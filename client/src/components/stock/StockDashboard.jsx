import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StockDashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStocks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stock');
      if (!res.data?.success) throw new Error('Invalid data format');
      setStocks(res.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setStocks([]);
      console.error('Stock fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStocks(); }, []);

  const chartData = {
    labels: stocks.map(s => s.productName),
    datasets: [
      {
        label: 'Current Stock',
        data: stocks.map(s => s.currentStock),
        backgroundColor: stocks.map(s =>
          s.currentStock < s.minStockLevel ? 'rgba(255, 99, 132, 0.6)' : 'rgba(54, 162, 235, 0.6)'
        ),
      }
    ]
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
      <p>Error: {error}</p>
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Stock Levels</h2>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <Bar data={chartData} height={150} options={{ maintainAspectRatio: false }} />
      </div>

      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Product</th>
            <th className="p-2 text-left">Stock</th>
            <th className="p-2 text-left">Type</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((s, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="p-2">{s.productName}</td>
              <td className={`p-2 ${s.currentStock < s.minStockLevel ? 'text-red-600 font-bold' : ''}`}>
                {s.currentStock} {s.currentStock < s.minStockLevel && '(Low!)'}
              </td>
              <td className="p-2">{s.storageType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockDashboard;
