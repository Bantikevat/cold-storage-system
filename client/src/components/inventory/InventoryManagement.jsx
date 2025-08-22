
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "../layout/Layout";
import Swal from 'sweetalert2';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [newItem, setNewItem] = useState({
    name: '',
    category: 'vegetable',
    quantity: '',
    unit: 'kg',
    minStock: '',
    location: '',
    expiryDate: '',
    supplier: '',
    cost: '',
    sellingPrice: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchTerm, filterType]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      // For now, using dummy data since we don't have inventory endpoint
      const dummyData = [
        {
          _id: '1',
          name: 'Potato',
          category: 'vegetable',
          quantity: 500,
          unit: 'kg',
          minStock: 100,
          location: 'Cold Room 1',
          expiryDate: '2024-12-31',
          supplier: 'Local Farm',
          cost: 20,
          sellingPrice: 25,
          status: 'in_stock'
        },
        {
          _id: '2',
          name: 'Onion',
          category: 'vegetable',
          quantity: 50,
          unit: 'kg',
          minStock: 100,
          location: 'Cold Room 2',
          expiryDate: '2024-11-30',
          supplier: 'Farm Co.',
          cost: 30,
          sellingPrice: 35,
          status: 'low_stock'
        }
      ];
      setInventory(dummyData);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch inventory data.',
        confirmButtonColor: '#0369a1'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterInventory = () => {
    let filtered = inventory;

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.status === filterType);
    }

    setFilteredInventory(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return 'text-green-700 bg-green-100';
      case 'low_stock': return 'text-yellow-700 bg-yellow-100';
      case 'out_of_stock': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'in_stock': return 'In Stock';
      case 'low_stock': return 'Low Stock';
      case 'out_of_stock': return 'Out of Stock';
      default: return 'Unknown';
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const newInventoryItem = {
        ...newItem,
        _id: Date.now().toString(),
        quantity: parseFloat(newItem.quantity),
        minStock: parseFloat(newItem.minStock),
        cost: parseFloat(newItem.cost),
        sellingPrice: parseFloat(newItem.sellingPrice),
        status: parseFloat(newItem.quantity) <= parseFloat(newItem.minStock) ? 'low_stock' : 'in_stock'
      };

      setInventory([...inventory, newInventoryItem]);
      setNewItem({
        name: '',
        category: 'vegetable',
        quantity: '',
        unit: 'kg',
        minStock: '',
        location: '',
        expiryDate: '',
        supplier: '',
        cost: '',
        sellingPrice: ''
      });
      setShowAddForm(false);

      Swal.fire({
        icon: 'success',
        title: 'Item Added!',
        text: 'Inventory item added successfully.',
        confirmButtonColor: '#0369a1'
      });
    } catch (error) {
      console.error('Error adding item:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add inventory item.',
        confirmButtonColor: '#0369a1'
      });
    }
  };

  const handleDeleteItem = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setInventory(inventory.filter(item => item._id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Inventory item has been deleted.',
        confirmButtonColor: '#0369a1'
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              📦 Inventory Management
            </h1>
            <p className="text-gray-600">Complete inventory tracking and management system</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-3xl font-bold text-green-600">{inventory.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">📦</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Stock</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {inventory.filter(item => item.status === 'in_stock').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">✅</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-yellow-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {inventory.filter(item => item.status === 'low_stock').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">⚠️</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                  <p className="text-3xl font-bold text-red-600">
                    {inventory.filter(item => item.status === 'out_of_stock').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xl">❌</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                >
                  <option value="all">All Items</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                ➕ Add Item
              </button>
            </div>
          </div>

          {/* Add Item Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Add New Item</h2>
                <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                    >
                      <option value="vegetable">Vegetable</option>
                      <option value="fruit">Fruit</option>
                      <option value="grain">Grain</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
                    <select
                      value={newItem.unit}
                      onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                    >
                      <option value="kg">Kg</option>
                      <option value="tons">Tons</option>
                      <option value="pieces">Pieces</option>
                      <option value="boxes">Boxes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Stock Level *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newItem.minStock}
                      onChange={(e) => setNewItem({...newItem, minStock: e.target.value})}
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={newItem.location}
                      onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="date"
                      value={newItem.expiryDate}
                      onChange={(e) => setNewItem({...newItem, expiryDate: e.target.value})}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                    <input
                      type="text"
                      value={newItem.supplier}
                      onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newItem.cost}
                      onChange={(e) => setNewItem({...newItem, cost: e.target.value})}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newItem.sellingPrice}
                      onChange={(e) => setNewItem({...newItem, sellingPrice: e.target.value})}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl transition-all duration-300 font-semibold"
                    >
                      Add Item
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl transition-all duration-300 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Inventory Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">Item</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Category</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Quantity</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Location</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Cost</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Selling Price</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-semibold text-gray-800">{item.name}</div>
                          <div className="text-sm text-gray-500">Supplier: {item.supplier}</div>
                        </div>
                      </td>
                      <td className="p-4 capitalize">{item.category}</td>
                      <td className="p-4">
                        <div>
                          <div className="font-semibold">{item.quantity} {item.unit}</div>
                          <div className="text-sm text-gray-500">Min: {item.minStock} {item.unit}</div>
                        </div>
                      </td>
                      <td className="p-4">{item.location}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </td>
                      <td className="p-4 font-semibold">₹{item.cost}</td>
                      <td className="p-4 font-semibold text-green-600">₹{item.sellingPrice}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredInventory.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">📦</div>
                  <p className="text-gray-500">No inventory items found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InventoryManagement;
