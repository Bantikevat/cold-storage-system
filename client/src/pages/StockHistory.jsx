import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';

const StockHistory = () => {
  const { itemName } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`https://cold-storage-system.onrender.com/api/stock/history/${itemName}`);
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching stock history", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [itemName]);

  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-green-700">📦 Stock History for: {itemName}</h2>
        {loading ? (
          <p>Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500">No history found for this item.</p>
        ) : (
          <table className="w-full border text-sm bg-white rounded shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, index) => (
                <tr key={index}>
                  <td className="p-2 border">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className={`p-2 border ${entry.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>{entry.type.toUpperCase()}</td>
                  <td className="p-2 border">{entry.quantity}</td>
                  <td className="p-2 border">{entry.remarks || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default StockHistory;

