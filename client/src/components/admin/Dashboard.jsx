import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import Layout from '../layout/Layout';

// ✅ Chart.js registration
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const Dashboard = () => {
  const [data, setData] = useState({
    totalProducts: 0,
    totalStockValue: 0,
    totalSales: 0,
    totalProfit: 0,
    stockLevels: [],
    salesData: [],
  });

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/dashboard/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stockChartData = {
    labels: data.stockLevels?.map(item => item.productName) || [],
    datasets: [
      {
        label: 'Stock Levels',
        data: data.stockLevels?.map(item => item.currentStock) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const salesChartData = {
    labels: data.salesData?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Sales',
        data: data.salesData?.map(item => item.amount) || [],
        fill: false,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-sky-700">📊 Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Products</h3>
            <p className="text-2xl">{data.totalProducts}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Stock Value</h3>
            <p className="text-2xl">${data.totalStockValue?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Sales</h3>
            <p className="text-2xl">${data.totalSales?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Profit</h3>
            <p className="text-2xl">${data.totalProfit?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Stock Levels</h3>
          <Bar data={stockChartData} options={{ responsive: true }} />
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Sales Performance</h3>
          <Line data={salesChartData} options={{ responsive: true }} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
