import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const StockForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [currentStock, setCurrentStock] = useState(0);
  const [minStockAlert, setMinStockAlert] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchStock = async () => {
        try {
          const res = await axios.get(`https://cold-storage-system.onrender.com/api/stock/${id}`);
          const stock = res.data;
          setProductName(stock.productName);
          setDescription(stock.description || '');
          setCurrentStock(stock.currentStock);
          setMinStockAlert(stock.minStockAlert);
        } catch (err) {
          setError('Failed to load stock data');
        }
      };
      fetchStock();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!productName.trim()) {
      setError('Product Name is required');
      setLoading(false);
      return;
    }

    if (isNaN(currentStock) || currentStock < 0) {
      setError('Current Stock must be a non-negative number');
      setLoading(false);
      return;
    }

    if (isNaN(minStockAlert) || minStockAlert < 0) {
      setError('Minimum Stock Alert must be a non-negative number');
      setLoading(false);
      return;
    }

    try {
      if (id) {
        await axios.put(`https://cold-storage-system.onrender.com/api/stock/update/${id}`, {
          productName: productName.trim(),
          description: description.trim(),
          currentStock: Number(currentStock),
          minStockAlert: Number(minStockAlert),
        });
      } else {
        await axios.post('https://cold-storage-system.onrender.com/api/stock/add', {
          productName: productName.trim(),
          description: description.trim(),
          currentStock: Number(currentStock),
          minStockAlert: Number(minStockAlert),
        });
      }
      navigate('/stock'); // ✅ Redirect to stock list
    } catch (err) {
      setError('Failed to save stock: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8 animate-fade-in">
        <h2 className="text-xl font-bold text-sky-700 mb-4">{id ? 'Edit Product' : 'Add New Product'}</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!id && (
            <div>
              <label className="block mb-1 font-medium">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>
          )}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-sky-400"
              rows={3}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Current Stock</label>
            <input
              type="number"
              value={currentStock}
              onChange={(e) => setCurrentStock(Number(e.target.value))}
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-sky-400"
              min={0}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Minimum Stock Alert</label>
            <input
              type="number"
              value={minStockAlert}
              onChange={(e) => setMinStockAlert(Number(e.target.value))}
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-sky-400"
              min={0}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white transition-all ${
              loading ? 'bg-sky-400 cursor-not-allowed' : 'bg-sky-700 hover:bg-sky-800'
            }`}
          >
            {loading ? 'Saving...' : id ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default StockForm;
