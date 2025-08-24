import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../layout/Layout";
import Swal from "sweetalert2";
import API_ENDPOINTS from "../../config/api";

const StockReport = () => {
  const [reportData, setReportData] = useState({
    report: [],
    overallTotals: {},
    timestamp: ""
  });
  const [loading, setLoading] = useState(true);
  const [filteredReport, setFilteredReport] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchStockReport();
  }, []);

  useEffect(() => {
    filterReport();
  }, [reportData.report, searchTerm, filterStatus]);

  const fetchStockReport = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.STOCK_REPORT);
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching stock report:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch stock report",
        confirmButtonColor: "#0369a1"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterReport = () => {
    let filtered = reportData.report || [];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(item => item.stockStatus === filterStatus);
    }

    setFilteredReport(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OK": return "text-green-700 bg-green-100";
      case "LOW_STOCK": return "text-yellow-700 bg-yellow-100";
      default: return "text-gray-700 bg-gray-100";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "OK": return "In Stock";
      case "LOW_STOCK": return "Low Stock";
      default: return "Unknown";
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(amount);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-xl font-semibold text-blue-600">
            Loading Stock Report...
          </span>
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
              📊 Stock Report & Analysis
            </h1>
            <p className="text-gray-600">
              Comprehensive tracking of stock purchases, sales, and current inventory
            </p>
            <div className="mt-2 text-sm text-gray-500">
              Last updated: {new Date(reportData.timestamp).toLocaleString()}
            </div>
          </div>

          {/* Overall Statistics */}
          {reportData.overallTotals && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {reportData.overallTotals.totalProducts}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xl">📦</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Stock</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatNumber(reportData.overallTotals.totalCurrentStock)} kg
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Purchased</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {formatNumber(reportData.overallTotals.totalPurchased)} kg
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-xl">🛍️</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sold</p>
                    <p className="text-3xl font-bold text-red-600">
                      {formatNumber(reportData.overallTotals.totalSold)} kg
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xl">💰</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Summary */}
          {reportData.overallTotals && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
                <h3 className="text-lg font-semibold text-orange-800 mb-4">💰 Financial Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Investment</span>
                    <span className="font-bold text-orange-600">
                      {formatCurrency(reportData.overallTotals.totalInvestment)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(reportData.overallTotals.totalRevenue)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">Net Profit</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(reportData.overallTotals.totalRevenue - reportData.overallTotals.totalInvestment)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border border-yellow-100">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">📈 Stock Movement</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Net Stock Change</span>
                    <span className="font-bold text-blue-600">
                      {formatNumber(reportData.overallTotals.totalPurchased - reportData.overallTotals.totalSold)} kg
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Stock Efficiency</span>
                    <span className="font-bold text-green-600">
                      {reportData.overallTotals.totalPurchased > 0 
                        ? ((reportData.overallTotals.totalSold / reportData.overallTotals.totalPurchased) * 100).toFixed(1) + "%"
                        : "0%"
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
                <h3 className="text-lg font-semibold text-red-800 mb-4">⚠️ Stock Alerts</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Low Stock Items</span>
                    <span className="font-bold text-red-600">
                      {reportData.overallTotals.lowStockItems}
                    </span>
                  </div>
                  {reportData.overallTotals.lowStockItems > 0 && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                      ⚠️ {reportData.overallTotals.lowStockItems} products need immediate attention
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="OK">In Stock</option>
                  <option value="LOW_STOCK">Low Stock</option>
                </select>
              </div>
              <button
                onClick={fetchStockReport}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Detailed Report Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">Product</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Current Stock</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Purchased</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Sold</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Net Change</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Investment</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Revenue</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReport.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 font-semibold text-gray-800">{item.productName}</td>
                      <td className="p-4 font-bold text-blue-600">{formatNumber(item.currentStock)} kg</td>
                      <td className="p-4 text-green-600">{formatNumber(item.totalPurchased)} kg</td>
                      <td className="p-4 text-red-600">{formatNumber(item.totalSold)} kg</td>
                      <td className="p-4 font-bold">
                        <span className={item.netChange >= 0 ? "text-green-600" : "text-red-600"}>
                          {item.netChange >= 0 ? "+" : ""}{formatNumber(item.netChange)} kg
                        </span>
                      </td>
                      <td className="p-4">{formatCurrency(item.totalPurchasedAmount)}</td>
                      <td className="p-4 font-semibold text-green-600">{formatCurrency(item.totalSoldAmount)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.stockStatus)}`}>
                          {getStatusText(item.stockStatus)}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(item.lastUpdated).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredReport.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">📊</div>
                  <p className="text-gray-500">No stock data found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StockReport;
