import React from 'react';

const StorageFilterBar = ({ filters, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white p-4 shadow rounded mb-4">
      
      {/* Farmer Name */}
      <input
        type="text"
        name="farmer"
        value={filters.farmer}
        onChange={onChange}
        placeholder="🔍 Farmer Name"
        className="border px-3 py-2 rounded"
      />

      {/* Product */}
      <input
        type="text"
        name="product"
        value={filters.product}
        onChange={onChange}
        placeholder="🥕 Product Name"
        className="border px-3 py-2 rounded"
      />

      {/* Status */}
      <select
        name="status"
        value={filters.status}
        onChange={onChange}
        className="border px-3 py-2 rounded"
      >
        <option value="">📦 Status (All)</option>
        <option value="in">🟢 In Storage</option>
        <option value="out">🔴 Out</option>
      </select>

      {/* From Date */}
      <input
        type="date"
        name="fromDate"
        value={filters.fromDate}
        onChange={onChange}
        className="border px-3 py-2 rounded"
      />

      {/* To Date */}
      <input
        type="date"
        name="toDate"
        value={filters.toDate}
        onChange={onChange}
        className="border px-3 py-2 rounded"
      />
    </div>
  );
};

export default StorageFilterBar;
