import React, { useState } from 'react';
import { FiFilter, FiX, FiCheck } from 'react-icons/fi';

const StockFilter = ({ onFilterChange, initialData }) => {
  const [filters, setFilters] = useState({
    productName: '',
    category: '',
    minStock: '',
    maxStock: '',
    stockStatus: 'all', // 'all', 'low', 'outOfStock', 'inStock'
    sortBy: 'name', // 'name', 'stock', 'date'
    sortOrder: 'asc' // 'asc', 'desc'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    onFilterChange(filters);
    setIsExpanded(false);
  };

  const resetFilters = () => {
    const resetValues = {
      productName: '',
      category: '',
      minStock: '',
      maxStock: '',
      stockStatus: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    };
    setFilters(resetValues);
    onFilterChange(resetValues);
  };

  // Sample categories - replace with your actual categories
  const categories = ['Electronics', 'Grocery', 'Clothing', 'Furniture', 'Other'];

  return (
    <div className="mb-8">
      {/* Filter Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Inventory Filters</h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiFilter />
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Expandable Filter Panel */}
      {isExpanded && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 overflow-auto max-h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Product Name Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                value={filters.productName}
                onChange={handleChange}
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Stock Range Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Stock Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minStock"
                  value={filters.minStock}
                  onChange={handleChange}
                  placeholder="Min"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
                <input
                  type="number"
                  name="maxStock"
                  value={filters.maxStock}
                  onChange={handleChange}
                  placeholder="Max"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
            </div>

            {/* Stock Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Status
              </label>
              <select
                name="stockStatus"
                value={filters.stockStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="low">Low Stock</option>
                <option value="outOfStock">Out of Stock</option>
                <option value="inStock">In Stock</option>
              </select>
            </div>

            {/* Sorting Options */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Sort By
              </label>
              <div className="flex gap-2">
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="name">Product Name</option>
                  <option value="stock">Stock Level</option>
                  <option value="date">Last Updated</option>
                </select>
                <select
                  name="sortOrder"
                  value={filters.sortOrder}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FiX /> Reset
            </button>
            <button
              onClick={applyFilters}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiCheck /> Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockFilter;
