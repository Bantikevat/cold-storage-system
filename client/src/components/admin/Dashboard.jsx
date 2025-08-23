import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../layout/Layout";
import { Link } from "react-router-dom";

const CompleteDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    farmers: { total: 0, recent: [] },
    purchases: { total: 0, amount: 0, recent: [] },
    sales: { total: 0, amount: 0, recent: [] },
    customers: { total: 0, recent: [] },
    storage: { total: 0, capacity: 0, recent: [] },
    inventory: { items: 0, lowStock: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch farmers data
      const farmersRes = await axios.get(
        "https://cold-storage-system-1s.onrender.com/api/farmers/all?limit=1000"
      );
      const farmers = farmersRes.data.farmers || [];

      // Fetch purchases data
      const purchasesRes = await axios.get(
        "https://cold-storage-system-1s.onrender.com/api/purchases/all?limit=1000"
      );
      const purchases = purchasesRes.data.purchases || [];

      // Fetch sales data
      const salesRes = await axios.get(
        "https://cold-storage-system-1s.onrender.com/api/sales/all?limit=1000"
      );
      const sales = salesRes.data.sales || [];

      // Fetch customers data
      const customersRes = await axios.get(
        "https://cold-storage-system-1s.onrender.com/api/customers/all?limit=1000"
      );
      const customers = customersRes.data.customers || [];

      // Calculate totals
      const totalPurchaseAmount = purchases.reduce(
        (sum, p) => sum + (p.amount || 0),
        0
      );
      const totalSalesAmount = sales.reduce(
        (sum, s) => sum + (s.amount || 0),
        0
      );

      setDashboardData({
        farmers: {
          total: farmers.length,
          recent: farmers.slice(0, 5),
        },
        purchases: {
          total: purchases.length,
          amount: totalPurchaseAmount,
          recent: purchases.slice(0, 5),
        },
        sales: {
          total: sales.length,
          amount: totalSalesAmount,
          recent: sales.slice(0, 5),
        },
        customers: {
          total: customers.length,
          recent: customers.slice(0, 5),
        },
        storage: {
          total: 15,
          capacity: 85,
          recent: [],
        },
        inventory: {
          items: 25,
          lowStock: 3,
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-xl font-semibold text-blue-600">
            Loading Dashboard...
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
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              🏢 Cold Storage Management System
            </h1>
            <p className="text-gray-600 text-lg">
              Complete automation and management dashboard
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Farmers Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Farmers
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {dashboardData.farmers.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">👨‍🌾</span>
                </div>
              </div>
              <Link
                to="/farmer-list"
                className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
              >
                View All Farmers →
              </Link>
            </div>

            {/* Purchases Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Purchases
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {dashboardData.purchases.total}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{dashboardData.purchases.amount.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">🛍️</span>
                </div>
              </div>
              <Link
                to="/purchase-list"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                View All Purchases →
              </Link>
            </div>

            {/* Sales Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Sales
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {dashboardData.sales.total}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{dashboardData.sales.amount.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">💰</span>
                </div>
              </div>
              <Link
                to="/sales-list"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
              >
                View All Sales →
              </Link>
            </div>

            {/* Customers Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Customers
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    {dashboardData.customers.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-xl">👥</span>
                </div>
              </div>
              <Link
                to="/customer-list"
                className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
              >
                View All Customers →
              </Link>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Storage Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100">
              <h3 className="text-xl font-bold text-indigo-800 mb-4">
                🏬 Storage Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Items Stored</span>
                  <span className="font-bold text-indigo-600">
                    {dashboardData.storage.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Capacity Used</span>
                  <span className="font-bold text-indigo-600">
                    {dashboardData.storage.capacity}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${dashboardData.storage.capacity}%` }}
                  ></div>
                </div>
              </div>
              <Link
                to="/storage-list"
                className="inline-block mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
              >
                Manage Storage →
              </Link>
            </div>

            {/* Inventory Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-yellow-100">
              <h3 className="text-xl font-bold text-yellow-800 mb-4">
                📦 Inventory Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Items</span>
                  <span className="font-bold text-yellow-600">
                    {dashboardData.inventory.items}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Low Stock Items</span>
                  <span className="font-bold text-red-600">
                    {dashboardData.inventory.lowStock}
                  </span>
                </div>
                {dashboardData.inventory.lowStock > 0 && (
                  <div className="bg-red-50 text-red-700 p-2 rounded-lg text-sm">
                    ⚠️ {dashboardData.inventory.lowStock} items need restocking
                  </div>
                )}
              </div>
              <Link
                to="/inventory"
                className="inline-block mt-4 text-yellow-600 hover:text-yellow-700 text-sm font-medium transition-colors"
              >
                Manage Inventory →
              </Link>
            </div>

            {/* Profit Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100">
              <h3 className="text-xl font-bold text-green-800 mb-4">
                📈 Profit Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-bold text-green-600">
                    ₹{dashboardData.sales.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Investment</span>
                  <span className="font-bold text-red-600">
                    ₹{dashboardData.purchases.amount.toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">
                    Net Profit
                  </span>
                  <span className="font-bold text-green-600">
                    ₹
                    {(
                      dashboardData.sales.amount -
                      dashboardData.purchases.amount
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              ⚡ Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Link
                to="/add-farmer"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">👨‍🌾</div>
                  <div className="text-sm font-semibold">Add Farmer</div>
                </div>
              </Link>

              <Link
                to="/add-purchase"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🛍️</div>
                  <div className="text-sm font-semibold">Add Purchase</div>
                </div>
              </Link>

              <Link
                to="/sales-entry"
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="text-sm font-semibold">Add Sale</div>
                </div>
              </Link>

              <Link
                to="/add-customer"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="text-sm font-semibold">Add Customer</div>
                </div>
              </Link>

              <Link
                to="/add-storage"
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🏬</div>
                  <div className="text-sm font-semibold">Add Storage</div>
                </div>
              </Link>

              <Link
                to="/automation"
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🤖</div>
                  <div className="text-sm font-semibold">Automation</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Purchases */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                🛍️ Recent Purchases
              </h3>
              {dashboardData.purchases.recent.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.purchases.recent.map((purchase, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-semibold">{purchase.variety}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">
                          ₹{purchase.amount}
                        </div>
                        <div className="text-sm text-gray-500">
                          {purchase.bags} bags
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No recent purchases
                </p>
              )}
            </div>

            {/* Recent Sales */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                💰 Recent Sales
              </h3>
              {dashboardData.sales.recent.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.sales.recent.map((sale, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-semibold">{sale.product}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(sale.saleDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          ₹{sale.amount}
                        </div>
                        <div className="text-sm text-gray-500">
                          {sale.quantity} kg
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No recent sales
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompleteDashboard;
