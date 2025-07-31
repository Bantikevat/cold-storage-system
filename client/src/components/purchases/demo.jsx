import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logos from "../../assets/image/logo.jpg"; // Make sure path is correct

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) return alert('Please enter your email!');
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/otp/send-otp', { email });
      localStorage.setItem('adminEmail', email);
      navigate('/otp');
    } catch (err) {
      alert('Error sending OTP');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-sky-100 px-4 font-[Outfit]">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200 animate-fade-in">
        
        {/* Left image section */}
        <div className="hidden md:flex w-1/2 bg-sky-50 items-center justify-center p-6">
          <img
            src={logos}
            alt="KT Traders"
            className="rounded-xl w-full max-w-[90%] shadow-lg"
          />
        </div>

        {/* Right login form section */}
        <div className="w-full md:w-1/2 p-8 md:p-10">
          <h2 className="text-3xl font-bold text-sky-700 mb-1">KT TRADERS</h2>
          <p className="text-sm text-gray-500 mb-6">Admin Login — Cold Storage Panel</p>

          <label className="block mb-2 text-sm font-medium text-gray-600">
            Enter Admin Email
          </label>
          <input
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 transition"
          />

          <button
            onClick={handleSendOTP}
            disabled={loading}
            className={`mt-4 w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Sending OTP...' : '📩 Send OTP'}
          </button>

          <p className="mt-6 text-xs text-gray-400 text-center">
            Powered by <strong>KT Traders Storage System</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../layout/Layout';
import axios from 'axios';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { FiRefreshCw } from 'react-icons/fi';
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';

ChartJS.register(
  LineElement, PointElement, LinearScale, CategoryScale,
  ArcElement, Title, Tooltip, Legend, BarElement
);

const API = 'http://localhost:5000/api';

const StatCard = ({ title, value, color, border, note, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`bg-white border-l-8 ${border} rounded-lg p-5 shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-300`}
  >
    <div className="flex items-center justify-between">
      <h2 className="text-base font-semibold text-gray-600">{title}</h2>
      {icon}
    </div>
    <p className={`text-3xl ${color} font-bold mt-2`}>{value}</p>
    {note && <p className="text-xs text-gray-400 mt-1">{note}</p>}
  </motion.div>
);

const Skeleton = ({ height = 'h-32' }) => (
  <div className={`animate-pulse bg-gray-100 rounded ${height}`} />
);

const RangeTabs = ({ range, setRange }) => {
  const tabs = ['week', 'month', 'year'];
  return (
    <div className="flex items-center gap-2">
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => setRange(t)}
          className={`px-3 py-1 rounded-full text-sm capitalize border ${
            range === t ? 'bg-green-600 text-white' : 'bg-white hover:bg-gray-100'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [chart, setChart] = useState(null);
  const [range, setRange] = useState('week');
  const [activity, setActivity] = useState(null);
  const [lowStock, setLowStock] = useState(null);
  const [coldRooms, setColdRooms] = useState(null);
  const [clock, setClock] = useState(new Date());

  const [loading, setLoading] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [s, a, l, c] = await Promise.all([
        axios.get(`${API}/dashboard/summary`),
        axios.get(`${API}/dashboard/activity`),
        axios.get(`${API}/stock/low`),
        axios.get(`${API}/dashboard/cold-rooms`)
      ]);
      setSummary(s.data);
      setActivity(a.data);
      setLowStock(l.data);
      setColdRooms(c.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadChart = async () => {
    try {
      setLoadingChart(true);
      const res = await axios.get(`${API}/dashboard/chart?range=${range}`);
      setChart(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingChart(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    loadChart();
  }, [range]);

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const purchaseSaleChart = useMemo(() => {
    if (!chart) return null;
    return {
      labels: chart.labels,
      datasets: [
        {
          label: 'Purchase (kg)',
          data: chart.purchaseSeries,
          fill: true,
          backgroundColor: 'rgba(34,197,94,0.15)',
          borderColor: 'rgb(34,197,94)',
          tension: 0.35,
        },
        {
          label: 'Sale (kg)',
          data: chart.saleSeries,
          fill: false,
          backgroundColor: 'rgba(59,130,246,0.15)',
          borderColor: 'rgb(59,130,246)',
          tension: 0.35,
        }
      ]
    };
  }, [chart]);

  const coldRoomChart = useMemo(() => {
    if (!coldRooms) return null;
    return {
      labels: ['Used', 'Available'],
      datasets: [
        {
          data: [coldRooms.used, coldRooms.available],
          backgroundColor: ['#8b5cf6', '#e5e7eb'],
          hoverBackgroundColor: ['#7c3aed', '#d1d5db'],
          borderWidth: 0
        }
      ]
    };
  }, [coldRooms]);

  return (
    <Layout>
      <div className="pt-20 px-4 sm:px-6 lg:px-8 font-[Outfit] min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              👋 Welcome back, <span className="text-green-600">Admin</span>
            </h1>
            <p className="text-sm text-gray-500">
              {clock.toLocaleDateString()} • {clock.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={() => { loadAll(); loadChart(); }}
            className="flex items-center gap-2 bg-white border hover:bg-gray-100 px-3 py-2 rounded shadow text-sm"
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton /> <Skeleton /> <Skeleton /> <Skeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Bags Stored" value={summary?.totalBagsStored?.toLocaleString() || 0} color="text-green-600" border="border-green-500" note="Across all farmers" icon={<AiOutlineArrowUp className="text-green-500" />} />
            <StatCard title="Active Customers" value={summary?.activeCustomers || 0} color="text-blue-600" border="border-blue-500" note="Unique customers" icon={<AiOutlineArrowUp className="text-blue-500" />} />
            <StatCard title="Cold Rooms In Use" value={`${summary?.coldRoomsInUse?.used || 0} / ${summary?.coldRoomsInUse?.total || 0}`} color="text-purple-600" border="border-purple-500" note="Capacity usage" icon={<AiOutlineArrowDown className="text-purple-500" />} />
            <StatCard title="Total Sales (₹)" value={(summary?.totalSales || 0).toLocaleString()} color="text-rose-600" border="border-rose-500" note="Lifetime revenue" icon={<AiOutlineArrowUp className="text-rose-500" />} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 bg-white p-6 rounded shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-700">📊 {range[0].toUpperCase() + range.slice(1)} Purchase vs Sale</h2>
              <RangeTabs range={range} setRange={setRange} />
            </div>
            {loadingChart || !purchaseSaleChart ? (
              <Skeleton height="h-64" />
            ) : (
              <div className="h-64">
                <Line
                  key={JSON.stringify(purchaseSaleChart)}
                  data={purchaseSaleChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          autoSkip: true,
                          maxTicksLimit: 5 // Adjust this value as needed
                        }
                      },
                      x: {
                        ticks: {
                          autoSkip: true,
                          maxTicksLimit: 10 // Adjust this value as needed
                        }
                      }
                    }
                  }}
                  height={300} // Set a fixed height for better responsiveness
                />
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-bold text-gray-700 mb-4">🫓 Cold Room Occupancy</h2>
            {!coldRoomChart ? (
              <Skeleton height="h-64" />
            ) : (
              <div className="h-64">
                <Doughnut
                  key={JSON.stringify(coldRoomChart)}
                  data={coldRoomChart}
                  options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
                  height={260}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
// ✅ src/components/admin/OTPVerify.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OTPVerify = () => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60); // ⏱️ 1 minute countdown
  const [showResentMsg, setShowResentMsg] = useState(false); // ✅ Alert message flag
  const navigate = useNavigate();
  const email = localStorage.getItem('adminEmail');

  // 🕒 Countdown Timer useEffect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // ✅ OTP Verify Handler
  const handleVerifyOTP = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/otp/verify-otp', { otp });
      if (res.data.verified) {
        navigate('/dashboard');
      } else {
        alert('❌ Invalid OTP');
      }
    } catch (err) {
      alert('❌ OTP verification failed');
      console.error(err);
    }
  };

  // 🔁 Resend OTP Handler
  const handleResendOTP = async () => {
    try {
      await axios.post('http://localhost:5000/api/otp/send-otp', { email });
      setTimer(60); // reset timer
      setShowResentMsg(true); // show alert
      setTimeout(() => setShowResentMsg(false), 4000); // hide after 4s
    } catch (err) {
      alert('❌ Failed to resend OTP');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 font-[Outfit] p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-sky-700 mb-2">Enter OTP</h2>
        <p className="text-sm text-gray-500 mb-4">OTP has been sent to <strong>{email}</strong></p>

        {/* 🔢 OTP Input */}
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition mb-4"
        />

        {/* ✅ Submit Button */}
        <button
          onClick={handleVerifyOTP}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          ✅ Verify OTP
        </button>

        {/* 🔁 Resend OTP section */}
        <div className="mt-6 text-sm text-gray-600 text-center">
          {timer > 0 ? (
            <span>⏳ You can resend OTP in <strong>{timer}s</strong></span>
          ) : (
            <button
              onClick={handleResendOTP}
              className="text-sky-600 hover:underline font-semibold"
            >
              🔁 Resend OTP
            </button>
          )}
        </div>

        {/* 📩 OTP Resent Alert */}
        {showResentMsg && (
          <div className="mt-4 bg-sky-100 text-sky-800 border border-sky-300 px-4 py-3 rounded-lg shadow-sm text-sm animate-fadeIn transition-all duration-300">
            📩 OTP has been resent to your email successfully.
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPVerify;
// ✅ src/components/farmers/AddFarmer.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../layout/Layout"; // Assuming you have a Layout component
import { Link } from 'react-router-dom';

const AddFarmer = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    aadhaar: "",
    email: "",
    preferredRoom: "",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:5000/api/farmers/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setNotification({ 
          show: true, 
          type: 'success', 
          message: "✅ Farmer added successfully!" 
        });
        setFormData({
          name: "",
          phone: "",
          address: "",
          aadhaar: "",
          email: "",
          preferredRoom: "",
        });
        // Auto hide notification after 5 seconds
        setTimeout(() => {
          setNotification({ show: false, type: '', message: '' });
        }, 5000);
      } else {
        setNotification({ 
          show: true, 
          type: 'error', 
          message: `❌ Failed: ${data.message || 'Unknown error occurred'}` 
        });
      }
    } catch (error) {
      setNotification({ 
        show: true, 
        type: 'error', 
        message: "❌ Error adding farmer" 
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6 bg-gray-50 min-h-screen w-full"
      >
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-0">➕ Add New Farmer</h2>
          <Link 
            to="/farmers" 
            className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
          >
            👨‍🌾 View Farmers List
          </Link>
        </div>

        {/* Notification Banner */}
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-6 p-4 rounded-lg ${
              notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
              'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {notification.message}
            <button 
              onClick={() => setNotification({ show: false, type: '', message: '' })} 
              className="float-right text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Form Card */}
        <motion.div 
          whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.06)" }}
          transition={{ duration: 0.2 }}
          className="bg-white p-5 sm:p-8 rounded-2xl shadow-md w-full max-w-4xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {/* Name Field */}
              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">👤 Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter farmer name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-1">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">📱 Phone Number</label>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Address Field */}
              <div className="space-y-1 sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">🏠 Address</label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Aadhaar Field */}
              <div className="space-y-1">
                <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700">🆔 Aadhaar Number</label>
                <input
                  id="aadhaar"
                  type="text"
                  name="aadhaar"
                  placeholder="Enter Aadhaar number"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">📧 Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Preferred Room Field */}
              <div className="space-y-1 sm:col-span-2">
                <label htmlFor="preferredRoom" className="block text-sm font-medium text-gray-700">❄️ Preferred Cold Room</label>
                <input
                  id="preferredRoom"
                  type="text"
                  name="preferredRoom"
                  placeholder="Enter preferred cold room"
                  value={formData.preferredRoom}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Optional field</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center sm:justify-end pt-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-6 sm:px-8 rounded-xl text-base sm:text-lg font-semibold shadow-md transition-colors ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  '✅ Save Farmer'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default AddFarmer;
// ✅ src/components/farmers/EditFarmer.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../layout/Layout';

const EditFarmer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', aadhaar: '', email: '', preferredRoom: '',
  });

  useEffect(() => {
    const fetchFarmer = async () => {
      const res = await axios.get(`http://localhost:5000/api/farmers/all`);
      const found = res.data.find(f => f._id === id);
      if (found) setFormData(found);
    };
    fetchFarmer();
  }, [id]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/farmers/update/${id}`, formData);
      navigate('/farmers');
    } catch (err) {
      console.error('Error updating farmer:', err.message);
    }
  };

  return (
    <Layout>
    <div className="md:ml-64 mt-16 p-4 md:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">✏️ Edit Farmer</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar</label>
            <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Room</label>
            <input type="text" name="preferredRoom" value={formData.preferredRoom} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div className="mt-6 text-right">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow">
            Update Farmer
          </button>
        </div>
      </form>
    </div>
    </Layout>
  );
};

export default EditFarmer;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Layout from '../layout/Layout';
import '../../css/print.css'; // Ensure you have a print.css for print styles

const FarmerLedger = () => {
  const { farmerId } = useParams();
  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [farmerName, setFarmerName] = useState("");
  const [farmerPhone, setFarmerPhone] = useState("");
  const [farmerAddress, setFarmerAddress] = useState("");
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const fetchFarmerInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/farmers/all`);
        const farmer = res.data.find(f => f._id === farmerId);
        if (farmer) {
          setFarmerName(farmer.name);
          setFarmerPhone(farmer.phone);
          setFarmerAddress(farmer.address);
        }
      } catch (err) {
        console.error('Error fetching farmer info:', err.message);
      }
    };

    const fetchLedger = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/farmers/ledger/${farmerId}`);
        setLedger(res.data);
      } catch (err) {
        console.error("Ledger fetch failed", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerInfo();
    fetchLedger();
  }, [farmerId]);

  const handleFilter = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/farmers/ledger/${farmerId}`, {
        params: { from: fromDate, to: toDate }
      });
      setLedger(res.data);
    } catch (error) {
      console.error('Filter failed:', error.message);
    }
  };

  const handleDownloadPDF = async () => {
    const input = document.getElementById('ledgerSection');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${farmerName}_ledger.pdf`);
  };

  if (loading) return <Layout><p className="text-center mt-10">Loading...</p></Layout>;
  if (!ledger) return <Layout><p className="text-center mt-10">No ledger found.</p></Layout>;

  const { storageEntries, purchases, payments, summary } = ledger;

  return (
    <Layout>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    
    {/* 🔍 Filters & Actions */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 no-print">
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm">
          From:
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
            className="ml-2 border px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </label>
        <label className="text-sm">
          To:
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
            className="ml-2 border px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </label>
        <button onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition">
          🔍 Filter
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button onClick={() => window.print()}
          className="bg-gray-700 text-white px-4 py-1.5 rounded hover:bg-gray-800 transition">
          🖨️ Print
        </button>
        <button onClick={handleDownloadPDF}
          className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 transition">
          📄 Download PDF
        </button>
      </div>
    </div>

    {/* 🧾 Farmer Info */}
    <div id="ledgerSection">
      <div className="bg-white shadow-sm border border-gray-200 rounded-md p-5 mb-6">
        <h2 className="text-2xl font-semibold text-green-700 mb-2">🧾 Ledger of: {farmerName}</h2>
        <p className="text-gray-600 text-sm">📞 {farmerPhone || 'N/A'} &nbsp;&nbsp;|&nbsp;&nbsp; 📍 {farmerAddress || 'N/A'}</p>
      </div>

      {/* 📊 Summary */}
      <div className="bg-gray-50 border border-gray-200 p-5 rounded-md mb-8">
        <h3 className="text-xl font-semibold mb-3">🔢 Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white rounded shadow p-3">💼 <strong>Storage Rent:</strong> ₹{summary.totalStorageRent || 0}</div>
          <div className="bg-white rounded shadow p-3">🛒 <strong>Purchases:</strong> ₹{summary.totalPurchase || 0}</div>
          <div className="bg-white rounded shadow p-3">💸 <strong>Paid:</strong> ₹{summary.totalPaid || 0}</div>
          <div className="bg-white rounded shadow p-3 text-red-600"><strong>Outstanding:</strong> ₹{summary.outstanding || 0}</div>
        </div>
      </div>

      {/* 🏬 Storage Entries */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">🏬 Storage Entries</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-left">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 border">Date In</th>
                <th className="p-3 border">Date Out</th>
                <th className="p-3 border">Quantity</th>
                <th className="p-3 border">Rate</th>
              </tr>
            </thead>
            <tbody>
              {storageEntries.length > 0 ? (
                storageEntries.map((entry, index) => (
                  <tr key={index} className="even:bg-blue-50">
                    <td className="p-3 border">{new Date(entry.storageDate).toLocaleDateString()}</td>
                    <td className="p-3 border">{entry.outDate ? new Date(entry.outDate).toLocaleDateString() : '—'}</td>
                    <td className="p-3 border">{entry.quantity}</td>
                    <td className="p-3 border">₹{entry.rate}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center p-4 text-gray-500">No storage entries</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🛒 Purchases */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">🛒 Purchases</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-left">
            <thead className="bg-green-100">
              <tr>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Item</th>
                <th className="p-3 border">Quantity</th>
                <th className="p-3 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length > 0 ? (
                purchases.map((item, index) => (
                  <tr key={index} className="even:bg-green-50">
                    <td className="p-3 border">{new Date(item.purchaseDate).toLocaleDateString()}</td>
                    <td className="p-3 border">{item.variety}</td>
                    <td className="p-3 border">{item.totalWeight} kg</td>
                    <td className="p-3 border">₹{item.amount}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center p-4 text-gray-500">No purchases found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 💸 Payments */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">💸 Payments</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-left">
            <thead className="bg-yellow-100">
              <tr>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((p, index) => (
                  <tr key={index} className="even:bg-yellow-50">
                    <td className="p-3 border">{new Date(p.date).toLocaleDateString()}</td>
                    <td className="p-3 border">₹{p.amount}</td>
                    <td className="p-3 border">{p.remarks || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" className="text-center p-4 text-gray-500">No payments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</Layout>

  );
};

export default FarmerLedger;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout'; // ✅ Sidebar layout import

const FarmerList = () => {
  const [farmers, setFarmers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/farmers/all');
      setFarmers(res.data);
    } catch (err) {
      console.error('Error fetching farmers:', err.message);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-farmer/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this farmer?")) {
      try {
        await axios.delete(`http://localhost:5000/api/farmers/delete/${id}`);
        fetchFarmers();
      } catch (err) {
        console.error("Error deleting farmer:", err.message);
      }
    }
  };

  const filteredFarmers = farmers.filter((farmer) => {
    const query = searchQuery.toLowerCase();
    return (
      farmer.name.toLowerCase().includes(query) ||
      farmer.phone.includes(query) ||
      farmer.address.toLowerCase().includes(query) ||
      farmer.aadhaar.includes(query) ||
      farmer.email.toLowerCase().includes(query) ||
      (farmer.preferredRoom && farmer.preferredRoom.toLowerCase().includes(query))
    );
  });

  return (
    <Layout> {/* ✅ Sidebar layout wrap start */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-700">📄 Farmer List</h2>
        <div className="flex items-center border rounded px-2 py-1 bg-white shadow w-full md:w-80">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search name, phone, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none w-full text-sm px-1"
          />
        </div>
      </div>

      <div className="overflow-auto rounded shadow bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-sky-100 text-sky-800">
            <tr>
              <th className="p-3 whitespace-nowrap">Name</th>
              <th className="p-3 whitespace-nowrap">Phone</th>
              <th className="p-3 whitespace-nowrap">Address</th>
              <th className="p-3 whitespace-nowrap">Aadhaar</th>
              <th className="p-3 whitespace-nowrap">Email</th>
              <th className="p-3 whitespace-nowrap">Preferred Room</th>
              <th className="p-3 whitespace-nowrap text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFarmers.length > 0 ? (
              filteredFarmers.map((farmer) => (
                <tr key={farmer._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 whitespace-nowrap">{farmer.name}</td>
                  <td className="p-3 whitespace-nowrap">{farmer.phone}</td>
                  <td className="p-3 whitespace-nowrap">{farmer.address}</td>
                  <td className="p-3 whitespace-nowrap">{farmer.aadhaar}</td>
                  <td className="p-3 whitespace-nowrap">{farmer.email}</td>
                  <td className="p-3 whitespace-nowrap">{farmer.preferredRoom}</td>
                  <td className="p-3 whitespace-nowrap flex justify-center gap-3">
  <button onClick={() => handleEdit(farmer._id)} className="text-blue-600 hover:text-blue-800">
    <FaEdit />
  </button>
  <button onClick={() => handleDelete(farmer._id)} className="text-red-600 hover:text-red-800">
    <FaTrash />
  </button>
 <button onClick={() => navigate(`/ledger/${farmer._id}`)}>🧾 Ledger</button>
<button
  onClick={() => navigate(`/add-payment/${farmer._id}`)}
  className="text-green-600 hover:text-green-800"
>
  ➕ Add Payment
</button>


</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">No farmers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
   </Layout> 
   
  );

};

export default FarmerList;
// ✅ src/layout/Layout.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (sidebarOpen && window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50 font-[Outfit] overflow-hidden">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar (fixed) */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {/* Topbar */}
        <Topbar setSidebarOpen={setSidebarOpen} />

        {/* Page content below topbar */}
        <main className="pt-16 px-3 sm:px-4 md:px-6 pb-10 overflow-y-auto h-screen w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
// ✅ src/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, X, Menu } from 'lucide-react';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

const MenuItem = ({ title, icon, children }) => {
  const location = useLocation();
  const path = location.pathname;
  
  // Automatically open menu if current path is in children
  const childPaths = React.Children.map(children, child => 
    child.props.to
  ) || [];
  
  const isActive = childPaths.some(childPath => path === childPath);
  const [open, setOpen] = useState(isActive);

  useEffect(() => {
    if (isActive && !open) setOpen(true);
  }, [path, isActive, open]);

  return (
    <div className="menu-item">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-2 py-2 rounded-lg transition-all duration-200 hover:bg-green-800/30 focus:outline-none focus:ring-1 focus:ring-green-500"
      >
        <span className="flex items-center gap-2 text-green-300 font-medium truncate">
          {icon} {title}
        </span>
        {children && (
          open ? <ChevronDown size={18} className="text-green-300 flex-shrink-0" /> : <ChevronRight size={18} className="text-green-300 flex-shrink-0" />
        )}
      </button>
      <div className={`ml-4 mt-1 overflow-hidden transition-all duration-300 ${open ? 'max-h-screen' : 'max-h-0'} flex flex-col gap-1`}>
        {children}
      </div>
    </div>
  );
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  // Close sidebar on navigation on mobile
  const location = useLocation();
  
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname, setSidebarOpen]);
  
  return (
    <aside
      className={clsx(
        'bg-gray-900 text-white fixed top-0 left-0 h-full w-64 md:w-72 z-50 transform transition-transform duration-300 ease-in-out shadow-xl border-r border-green-700 overflow-hidden',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0 md:static md:h-screen'
      )}
      onClick={(e) => e.stopPropagation()} // Prevent clicks from closing via overlay
    >
      <div className="p-4 sm:p-6 overflow-y-auto h-full flex flex-col">
        {/* ❌ Close button on mobile */}
        <div className="md:hidden flex justify-end mb-2">
          <button 
            onClick={() => setSidebarOpen(false)} 
            aria-label="Close Sidebar"
            className="p-1 rounded-full hover:bg-gray-800"
          >
            <X size={22} className="text-white hover:text-red-400 transition" />
          </button>
        </div>

        {/* 🔰 Logo */}
        <h2 className="text-xl sm:text-2xl font-extrabold mb-6 text-green-400 tracking-wide text-center md:text-left">
          ColdStorePro
        </h2>

        {/* ✅ Navigation Links - Scrollable area */}
        <nav className="flex flex-col gap-3 text-sm overflow-y-auto custom-scrollbar pr-1">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `hover:bg-green-800/20 px-3 py-2 rounded-lg text-green-300 font-medium transition flex items-center ${
                isActive ? 'bg-green-800/40 text-green-200' : ''
              }`
            }
          >
            📊 Dashboard
          </NavLink>

          <MenuItem title="🧾 Purchase">
            <NavLink 
              to="/purchase-entry" 
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${
                  isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              ➕ Entry
            </NavLink>
            <NavLink 
              to="/purchase-list" 
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${
                  isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              📋 List
            </NavLink>
            <NavLink
              to="/report"
              className={({ isActive }) =>
                `hover:translate-x-1 transition px-3 py-1.5 rounded-lg flex items-center ${
                  isActive ? 'text-green-500 font-medium bg-green-900/30' : 'hover:text-green-400'
                }`
              }
            >
              📊 Report
            </NavLink>
          </MenuItem>

          <MenuItem title="💰 Sales">
            <NavLink 
              to="/sales-entry" 
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${
                  isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              ➕ Entry
            </NavLink>
            <NavLink 
              to="/sales-list" 
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${
                  isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              📋 List
            </NavLink>
            <NavLink
              to="/sales-report"
              className={({ isActive }) =>
                `hover:translate-x-1 transition px-3 py-1.5 rounded-lg flex items-center ${
                  isActive ? 'text-green-500 font-medium bg-green-900/30' : 'hover:text-green-400'
                }`
              }
            >
              📊 Report
            </NavLink>
          </MenuItem>

          <MenuItem title="👥 Customers">
            <NavLink 
              to="/add-customer" 
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${
                  isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              ➕ Add Customer
            </NavLink>
            <NavLink 
              to="/customer-list" 
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${
                  isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              📋 Customer List
            </NavLink>
          </MenuItem>

          <MenuItem title="👨‍🌾 Farmers">
            <NavLink 
              to="/add-farmer" 
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${
                  isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              ➕ Add Farmer
            </NavLink>
            <NavLink 
              to="/farmers" 
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${
                  isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              📄 Farmer List
            </NavLink>
          </MenuItem>

          <MenuItem title="📦 Storage">
            <NavLink 
              to="/add-storage" 
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${
                  isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              ➕ Entry
            </NavLink>
            <NavLink 
              to="/storage-list" 
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${
                  isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              📋 List
            </NavLink>
          </MenuItem>

          <MenuItem title="👥 Clients">
            <NavLink 
              to="/add-client" 
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${
                  isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              ➕ Add
            </NavLink>
            <NavLink 
              to="/client-list" 
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${
                  isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              📄 List
            </NavLink>
          </MenuItem>

          <MenuItem title="📦 Stock">
  <NavLink 
    to="/stock-form" 
    className={({ isActive }) =>
      `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${
        isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
      }`
    }
  >
    ➕ Manual Stock Entry
  </NavLink>

  <NavLink 
    to="/stock-list" 
    className={({ isActive }) =>
      `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${
        isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
      }`
    }
  >
    📦 Stock List
  </NavLink>

  <NavLink 
    to="/stock-history" 
    className={({ isActive }) =>
      `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${
        isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
      }`
    }
  >
    📜 Stock History
  </NavLink>
</MenuItem>


          <NavLink 
            to="/reports" 
            className={({ isActive }) => 
              `hover:bg-green-800/20 px-3 py-2 rounded-lg text-green-300 font-medium transition flex items-center ${
                isActive ? 'bg-green-800/40 text-green-200' : ''
              }`
            }
          >
            📈 Reports
          </NavLink>
          
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `hover:bg-green-800/20 px-3 py-2 rounded-lg text-green-300 font-medium transition flex items-center ${
                isActive ? 'bg-green-800/40 text-green-200' : ''
              }`
            }
          >
            ⚙️ Settings
          </NavLink>
          
          <NavLink 
            to="/logout" 
            className="text-red-400 hover:text-red-300 px-3 py-2 rounded-lg transition flex items-center hover:bg-red-900/20"
          >
            🚪 Logout
          </NavLink>
        </nav>

        {/* Footer if needed */}
        <div className="mt-auto pt-4 text-center text-xs text-gray-500">
          v1.0.0 © KT Traders
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
// ✅ src/layout/Topbar.jsx
import React, { useState } from 'react';
import { FaBars, FaBell, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';

const Topbar = ({ setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-40 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 md:px-6">
      {/* Left side */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button 
          className="md:hidden p-1.5 rounded-md hover:bg-gray-100 transition-colors" 
          onClick={(e) => {
            e.stopPropagation();
            setSidebarOpen(true);
          }}
          aria-label="Open Sidebar"
        >
          <FaBars className="text-sky-700 text-lg sm:text-xl" />
        </button>
        <h1 className="text-base sm:text-lg md:text-xl font-semibold text-sky-700 truncate">
          ColdStorePro Admin
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors relative" aria-label="Notifications">
          <FaBell className="text-gray-600 text-sm sm:text-base" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* User dropdown */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="User menu"
          >
            <span className="text-gray-600 hidden sm:block text-sm">
              <span className="hidden md:inline">Welcome, </span><strong>Admin</strong>
            </span>
            <div className="h-7 w-7 sm:h-8 sm:w-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-700">
              <FaUser className="text-xs sm:text-sm" />
            </div>
          </button>
          
          {/* Dropdown menu */}
          {dropdownOpen && (
            <div 
              className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <a 
                href="/profile" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <FaUser className="text-gray-500" />
                Profile
              </a>
              <a 
                href="/settings" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <FaCog className="text-gray-500" />
                Settings
              </a>
              <hr className="my-1" />
              <a 
                href="/logout" 
                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
              >
                <FaSignOutAlt className="text-red-500" />
                Logout
              </a>
            </div>
          )}
        </div>
        
        {/* Separate logout button for smaller devices */}
        <a 
          href="/logout"
          className="bg-red-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded hover:bg-red-600 transition-all duration-200 flex items-center gap-1"
        >
          <FaSignOutAlt className="text-xs" />
          <span>Logout</span>
        </a>
      </div>
    </header>
  );
};

export default Topbar;
// src/components/payments/AddPayment.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../layout/Layout';
import { useParams, useNavigate } from 'react-router-dom';

const AddPayment = () => {
  const { farmerId } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/payments/add', {
        farmerId,
        amount,
        date,
        remarks,
      });
      alert('Payment added successfully');
      navigate(`/ledger/${farmerId}`);
    } catch (error) {
      console.error('Error adding payment:', error.message);
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">💸 Add Payment</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-md">
        <label className="block mb-2">Amount (₹):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />

        <label className="block mb-2">Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />

        <label className="block mb-2">Remarks:</label>
        <input
          type="text"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="border p-2 w-full mb-4"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Payment
        </button>
      </form>
    </Layout>
  );
};

export default AddPayment;
// ✅ src/components/purchases/AddPurchase.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from "../layout/Layout";

const AddPurchase = () => {
  const [formData, setFormData] = useState({
    farmerId: '',
    variety: '',
    bags: '',
    weightPerBag: '',
    ratePerKg: '',
    quality: '',
    remarks: ''
  });

  const [farmers, setFarmers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFarmers = async () => {
  try {
    const res =  await axios.get("http://localhost:5000/api/farmers/all");
    setFarmers(res.data);
  } catch (err) {
    console.error("Failed to fetch farmers", err);
  }
};
    fetchFarmers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotalWeight = () => {
    return (Number(formData.bags) * Number(formData.weightPerBag)).toFixed(2);
  };

  const calculateAmount = () => {
    return (calculateTotalWeight() * Number(formData.ratePerKg)).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      totalWeight: calculateTotalWeight(),
      amount: calculateAmount(),
      purchaseDate: new Date()
    };

    try {
      await axios.post('http://localhost:5000/api/purchases/', payload);
      navigate('/purchase-list');
    } catch (err) {
      console.error("Error saving purchase:", err.message);
      alert('Failed to save purchase');
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">🛍️ Add New Purchase</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-3xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="farmerId" value={formData.farmerId} onChange={handleChange} required className="border p-2 rounded">
              <option value="">Select Farmer</option>
              {farmers.map(farmer => (
                <option key={farmer._id} value={farmer._id}>{farmer.name}</option>
              ))}
            </select>

            <input type="text" name="variety" placeholder="Variety (e.g., Kufri Jyoti)" value={formData.variety} onChange={handleChange} required className="border p-2 rounded" />

            <input type="number" name="bags" placeholder="Total Bags" value={formData.bags} onChange={handleChange} required className="border p-2 rounded" />

            <input type="number" name="weightPerBag" placeholder="Weight per Bag (KG)" value={formData.weightPerBag} onChange={handleChange} required className="border p-2 rounded" />

            <input type="number" name="ratePerKg" placeholder="Rate per KG (₹)" value={formData.ratePerKg} onChange={handleChange} required className="border p-2 rounded" />

            <select name="quality" value={formData.quality} onChange={handleChange} required className="border p-2 rounded">
              <option value="">Select Quality</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>

            <input type="text" name="remarks" placeholder="Remarks (optional)" value={formData.remarks} onChange={handleChange} className="border p-2 rounded col-span-full" />
          </div>

          <div className="mt-4 text-gray-700">
            <p>Total Weight: <strong>{calculateTotalWeight()} kg</strong></p>
            <p>Total Amount: <strong>₹{calculateAmount()}</strong></p>
          </div>

          <button type="submit" className="mt-6 bg-sky-700 hover:bg-sky-800 text-white py-2 px-6 rounded">
            ➕ Save Purchase
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddPurchase;
// ✅ src/pages/EditPurchase.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../layout/Layout';

const EditPurchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/purchases/${id}`);
        setPurchase(res.data);
        setFormData({
          farmerId: res.data.farmerId?._id || '',
          variety: res.data.variety,
          ratePerKg: res.data.ratePerKg,
          bags: res.data.bags,
          weightPerBag: res.data.weightPerBag,
          totalWeight: res.data.totalWeight,
          amount: res.data.amount,
          remarks: res.data.remarks,
          quality: res.data.quality,
        });
      } catch (error) {
        console.error('Error fetching purchase:', error);
      }
    };
    if (id) fetchPurchase();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/purchases/${id}`, formData);
      alert('Purchase updated successfully!');
      navigate('/purchase-list');
    } catch (error) {
      console.error('Error updating purchase:', error);
      alert('Update failed.');
    }
  };

  if (!purchase) return <div className="p-10">Loading...</div>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white mt-16 p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6">📝 Edit Purchase</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Product Variety</label>
            <input
              type="text"
              name="variety"
              value={formData.variety}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Rate per Kg</label>
              <input
                type="number"
                name="ratePerKg"
                value={formData.ratePerKg}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Bags</label>
              <input
                type="number"
                name="bags"
                value={formData.bags}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Weight per Bag</label>
              <input
                type="number"
                name="weightPerBag"
                value={formData.weightPerBag}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Total Weight</label>
              <input
                type="number"
                name="totalWeight"
                value={formData.totalWeight}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium">Total Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Quality</label>
            <input
              type="text"
              name="quality"
              value={formData.quality}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-sky-700 text-white px-4 py-2 rounded hover:bg-sky-800"
          >
            ✅ Update Purchase
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditPurchase;
// ✅ src/pages/InvoicePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const InvoicePage = () => {
  const { id } = useParams();
  const [purchase, setPurchase] = useState(null);

  const downloadPDF = () => {
  const input = document.getElementById('invoice');
  html2canvas(input).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10);
    pdf.save(`Invoice-${id}.pdf`);
  });
};
  

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/purchases/${id}`);
        setPurchase(res.data);
      } catch (err) {
        console.error('Error fetching invoice:', err.message);
      }
    };
    if (id) fetchInvoice();
  }, [id]);

  if (!purchase) return <div className="p-10">Loading...</div>;

  const {
    farmerName,
    product,
    variety,
    ratePerKg,
    bags,
    weightPerBag,
    totalWeight,
    amount,
    quality,
    remarks,
    purchaseDate
  } = purchase;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow p-6 sm:p-10 mt-10 rounded-lg border-l-8 border-sky-700 font-[Outfit]">
      <div className="flex flex-col sm:flex-row justify-between border-b-2 border-sky-700 pb-4 mb-4">
        <div>
          <h2 className="text-3xl font-bold text-sky-700">KT TRADERS</h2>
          <p className="text-sm text-gray-600">Cold Storage & Aloo Supply Experts</p>
        </div>
        <div className="text-sm mt-4 sm:mt-0 text-gray-700 text-right">
          <p><strong>Invoice No:</strong> INV-{id.slice(-6).toUpperCase()}</p>
          <p><strong>Date:</strong> {new Date(purchaseDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mb-6 text-sm text-gray-700">
        <p><strong>Farmer:</strong> {purchase.farmerId?.name || farmerName}</p>
        <p><strong>Remarks:</strong> {remarks || 'N/A'}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-sky-700 text-white">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Product</th>
              <th className="p-2">Variety</th>
              <th className="p-2">Bags</th>
              <th className="p-2">Weight/Bag</th>
              <th className="p-2">Total Weight</th>
              <th className="p-2">Rate</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Quality</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center text-gray-700">
              <td className="p-2">1</td>
              <td className="p-2">{product}</td>
              <td className="p-2">{variety}</td>
              <td className="p-2">{bags}</td>
              <td className="p-2">{weightPerBag} kg</td>
              <td className="p-2">{totalWeight} kg</td>
              <td className="p-2">₹{ratePerKg}</td>
              <td className="p-2 font-semibold">₹{amount}</td>
              <td className="p-2">{quality}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-right text-lg font-semibold text-sky-700 mt-6">
        Total Payable: ₹{amount}
      </div>

      <div className="mt-10 text-sm text-gray-600 border-t pt-6">
        <p>Thank you for your business!</p>
        <p>This invoice is computer-generated and doesn't require a signature.</p>
        <p className="mt-6 text-right text-gray-700">
          <strong>Authorized Signature: _______________________</strong>
        </p>
      </div>

      <div className="mt-10 text-center print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-sky-700 text-white py-2 px-6 rounded hover:bg-sky-800"
        >
          🖨️ Print Invoice
        </button>
      </div>
      <button onClick={downloadPDF}>📄 Download PDF</button>

    </div>
  );
};

export default InvoicePage;
// ✅ src/components/purchase/PurchaseList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaDownload, FaPrint, FaEdit } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const PurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('');
  const [farmers, setFarmers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);


const [sortBy, setSortBy] = useState('date');      // default
const [sortOrder, setSortOrder] = useState('desc'); // asc / desc


  const navigate = useNavigate();

  useEffect(() => {
    fetchPurchases();
    fetchFarmers();
  }, [page, limit ,sortBy, sortOrder]);

  const fetchPurchases = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/purchases/all?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${sortOrder}`);
      const formatted = res.data.purchases.map((p) => ({
  ...p,
  farmerName: p.farmerId?.name || '',
  product: p.variety,
  quantity: p.totalWeight,
  rate: p.ratePerKg,
  total: p.amount,
  quality: p.quality,
  purchaseDate: p.purchaseDate, // ✅ raw ISO string for filtering
  date: new Date(p.purchaseDate).toLocaleDateString('en-IN'), // ✅ pretty date only for display
}));


      setPurchases(formatted);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Error fetching purchases:', err.message);
    }
  };

  const fetchFarmers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/farmers/all');
      setFarmers(res.data);
    } catch (err) {
      console.error('Error fetching farmers:', err.message);
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(purchases);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Purchases');
    XLSX.writeFile(wb, 'Purchase_Report.xlsx');
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/purchases/${id}`);
        setPurchases((prev) => prev.filter((p) => p._id !== id));
        MySwal.fire('Deleted!', 'Purchase has been deleted.', 'success');
      } catch (err) {
        console.error('Delete error:', err);
        MySwal.fire('Error!', 'Failed to delete purchase.', 'error');
      }
    }
  };

  const filteredPurchases = purchases.filter((item) => {
  const query = searchQuery.toLowerCase();

  const matchSearch =
    item.farmerName.toLowerCase().includes(query) ||
    item.product.toLowerCase().includes(query) ||
    item.date.toLowerCase().includes(query);

  const matchFarmer = selectedFarmer ? item.farmerId?._id === selectedFarmer : true;
  const matchQuality = selectedQuality ? item.quality === selectedQuality : true;

  const matchFromDate = fromDate
    ? new Date(item.purchaseDate).setHours(0, 0, 0, 0) >= new Date(fromDate).setHours(0, 0, 0, 0)
    : true;

  const matchToDate = toDate
    ? new Date(item.purchaseDate).setHours(0, 0, 0, 0) <= new Date(toDate).setHours(23, 59, 59, 999)
    : true;

  return matchSearch && matchFarmer && matchQuality && matchFromDate && matchToDate;
});



  return (
    <Layout>
      <div className="md:ml-100 mt-16 bg-gray-50 min-h-screen max-w-7xl mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto px-2 py-4">

          {/* 🔍 Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <input type="date" onChange={(e) => setFromDate(e.target.value)} className="border p-2 rounded" />
            <input type="date" onChange={(e) => setToDate(e.target.value)} className="border p-2 rounded" />
            <select onChange={(e) => setSelectedFarmer(e.target.value)} className="border p-2 rounded">
              <option value="">All Farmers</option>
              {farmers.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
            </select>
            <select onChange={(e) => setSelectedQuality(e.target.value)} className="border p-2 rounded">
              <option value="">All Quality</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
            <div className="flex items-center border rounded px-2 py-1 bg-white shadow w-full">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search farmer, product, date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline-none w-full text-sm px-1"
              />
            </div>
          </div>

          {/* 📤 Export & Print */}
          <div className="flex justify-end mb-4 gap-2">
            <button onClick={handleExport} className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
              <FaDownload className="inline mr-1" /> Excel
            </button>
            <button onClick={() => window.print()} className="bg-sky-600 text-white px-3 py-2 rounded hover:bg-sky-700">
              <FaPrint className="inline mr-1" /> Print
            </button>
          </div>

          {/* 📋 Table */}
          <div className="flex items-center gap-2 mb-4">
  <label className="text-sm font-medium">Sort By:</label>
  <select
    onChange={(e) => setSortBy(e.target.value)}
    className="border px-2 py-1 rounded"
  >
    <option value="date">Date</option>
    <option value="amount">Amount</option>
    <option value="farmer">Farmer Name</option>
  </select>

  <select
    onChange={(e) => setSortOrder(e.target.value)}
    className="border px-2 py-1 rounded"
  >
    <option value="desc">Descending</option>
    <option value="asc">Ascending</option>
  </select>
</div>

          <div className="overflow-auto rounded shadow bg-white">
            <table className="w-full text-sm text-left">
              <thead className="bg-sky-100 text-sky-800">
                <tr>
                  <th className="p-3">Farmer</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Qty (kg)</th>
                  <th className="p-3">Rate (₹)</th>
                  <th className="p-3">Total (₹)</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.length > 0 ? (
                  filteredPurchases.map((item, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="p-3">{item.farmerName}</td>
                      <td className="p-3">{item.product}</td>
                      <td className="p-3">{item.quantity}</td>
                      <td className="p-3">₹{item.rate}</td>
                      <td className="p-3 font-medium">₹{item.total}</td>
                      <td className="p-3">{item.date}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => navigate(`/edit-purchase/${item._id}`)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded"
                        >
                          <FaEdit className="inline" /> Edit
                        </button>
                        <button
                          onClick={() => window.open(`/invoice/${item._id}`, '_blank')}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded"
                        >
                          🧾 Invoice
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">No purchases found</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* 🔁 Pagination Controls */}
            <div className="flex justify-between items-center mt-4 px-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-sky-600 text-white rounded disabled:opacity-50"
              >
                ⬅️ Previous
              </button>

              <span className="text-gray-700">
                Page {page} of {Math.ceil(total / limit)}
              </span>

              <button
                onClick={() => setPage((prev) => (prev * limit < total ? prev + 1 : prev))}
                disabled={page * limit >= total}
                className="px-4 py-2 bg-sky-600 text-white rounded disabled:opacity-50"
              >
                Next ➡️
              </button>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PurchaseList;
// ✅ src/components/purchase/ReportPage.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FaDownload, FaPrint } from 'react-icons/fa';
import Layout from '../layout/Layout';

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [farmerList, setFarmerList] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState('');

  useEffect(() => {
    fetchFarmers();
    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - 30);
    setFromDate(past.toISOString().split('T')[0]);
    setToDate(today.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (fromDate && toDate) fetchReport();
  }, [fromDate, toDate, selectedFarmer]);

  const fetchFarmers = async () => {
    const res = await axios.get('http://localhost:5000/api/farmers/all');
    setFarmerList(res.data);
  };

  const fetchReport = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/purchases/report', {
        params: {
          fromDate,
          toDate,
          farmerId: selectedFarmer || undefined,
        },
      });
      setReports(res.data);
    } catch (err) {
      console.error('Failed to fetch report:', err);
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(reports.map((r) => ({
      Date: new Date(r.purchaseDate).toLocaleDateString('en-IN'),
      Farmer: r.farmerId?.name || 'N/A',
      Product: r.variety,
      Quantity: r.totalWeight,
      Rate: r.ratePerKg,
      Amount: r.amount,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, 'Purchase_Report.xlsx');
  };

  return (
    <Layout>
      <div className="md:ml-100 mt-16 px-4 py-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
        <h1 className="text-xl font-bold text-sky-800 mb-4">📊 Purchase Report</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded shadow mb-6">
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border p-2 rounded" />
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border p-2 rounded" />
          <select value={selectedFarmer} onChange={(e) => setSelectedFarmer(e.target.value)} className="border p-2 rounded">
            <option value="">All Farmers</option>
            {farmerList.map((f) => (
              <option key={f._id} value={f._id}>{f.name}</option>
            ))}
            <button onClick={fetchReport} className="bg-blue-600 text-white rounded px-4 py-2">Apply Filter</button>
          </select>
          <div className="flex gap-2">
            <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded w-full">
              <FaDownload className="inline mr-1" /> Excel
            </button>
            <button onClick={() => window.print()} className="bg-sky-600 text-white px-4 py-2 rounded w-full">
              <FaPrint className="inline mr-1" /> Print
            </button>
          </div>
        </div>

        <div className="overflow-auto bg-white shadow rounded">
          <table className="w-full text-sm">
            <thead className="bg-sky-100 text-sky-800">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Farmer</th>
                <th className="p-3 text-left">Variety</th>
                <th className="p-3 text-left">Qty (kg)</th>
                <th className="p-3 text-left">Rate (₹)</th>
                <th className="p-3 text-left">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? (
                reports.map((r, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-3">{new Date(r.purchaseDate).toLocaleDateString('en-IN')}</td>
                    <td className="p-3">{r.farmerId?.name || 'N/A'}</td>
                    
                    <td className="p-3">{r.variety}</td>
                    <td className="p-3">{r.totalWeight}</td>
                    <td className="p-3">₹{r.ratePerKg}</td>
                    <td className="p-3 font-semibold">₹{r.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ReportPage;
// src/components/customer/AddCustomer.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../layout/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AddCustomer = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await axios.post('http://localhost:5000/api/customers/add', form);
      setMessage({ type: 'success', text: '✅ Customer added successfully!' });
      setForm({ name: '', phone: '', email: '', address: '' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: '❌ Failed to add customer.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl mx-auto my-2 sm:my-4 px-3 sm:px-4"
      >
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 to-sky-500 px-4 py-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-white">➕ Add New Customer</h2>
              <Link 
                to="/customer-list" 
                className="text-sm bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1.5 rounded-md transition-all flex items-center justify-center gap-1 w-max"
              >
                📋 View List
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="p-4 sm:p-6">
            {message.text && (
              <div className={`mb-4 p-3 rounded-md text-sm ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.text}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  className="w-full border border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full border border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full border border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="address" className="text-sm font-medium text-gray-700">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  className="w-full border border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                  rows={3}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md w-full transition-colors flex items-center justify-center gap-2 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>➕ Add Customer</>
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default AddCustomer;
// src/components/customer/CustomerList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../layout/Layout';
import { Link } from 'react-router-dom';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  // ✅ Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers/all');
      setCustomers(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch customers:', err);
    }
  };

  // ✅ Delete customer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`);
      alert('✅ Customer deleted');
      fetchCustomers(); // refresh
    } catch (err) {
      console.error('❌ Failed to delete customer:', err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <Layout>
      <div className="mt-16 px-4 py-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-sky-800">📋 Customer List</h1>
          <Link
            to="/add-customer"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          >
            ➕ Add Customer
          </Link>
        </div>

        <div className="overflow-auto bg-white shadow rounded">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-sky-100 text-sky-800">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((c, i) => (
                  <tr key={c._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3">{c.name}</td>
                    <td className="p-3">{c.phone || 'N/A'}</td>
                    <td className="p-3">{c.email || 'N/A'}</td>
                    <td className="p-3">{c.address || 'N/A'}</td>
                    <td className="p-3 flex gap-2">
                      <Link
                        to={`/edit-customer/${c._id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No customers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerList;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';

const EditCustomer = () => {
  const { id } = useParams(); // Get customer ID from URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  // 🔹 Fetch customer by ID
  const fetchCustomer = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/customers/${id}`);
      setForm(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch customer:', err);
    }
  };

  // 🔹 Load customer on mount
  useEffect(() => {
    fetchCustomer();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/customers/${id}`, form);
      alert('✅ Customer updated successfully!');
      navigate('/customer-list');
    } catch (err) {
      console.error('❌ Failed to update customer:', err);
      alert('❌ Failed to update customer');
    }
  };

  return (
    <Layout>
      <div className="mt-16 px-4 py-6 max-w-xl mx-auto bg-white shadow-md rounded-md">
        <h2 className="text-lg sm:text-xl font-semibold text-sky-700 mb-4">✏️ Edit Customer</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Customer Name"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full border px-3 py-2 rounded"
            rows={3}
          />

          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded w-full"
          >
            💾 Save Changes
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditCustomer;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../layout/Layout';

const EditSales = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    product: '',
    quantity: '',
    rate: '',
    saleDate: '',
    remarks: ''
  });

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/sales/${id}`);
        setFormData({
          customerName: res.data.customerName || '',
          product: res.data.product || '',
          quantity: res.data.quantity || '',
          rate: res.data.rate || '',
          saleDate: res.data.saleDate?.split('T')[0] || '',
          remarks: res.data.remarks || ''
        });
      } catch (error) {
        console.error('Error fetching sale:', error);
      }
    };
    if (id) fetchSale();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { quantity, rate } = formData;

    try {
      await axios.put(`http://localhost:5000/api/sales/${id}`, {
        ...formData,
        quantity: Number(quantity),
        rate: Number(rate),
        amount: Number(quantity) * Number(rate),
      });
      alert('✅ Sale updated successfully!');
      navigate('/sales-list');
    } catch (error) {
      console.error('Error updating sale:', error);
      alert('❌ Update failed.');
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-8 bg-white shadow p-6 rounded">
        <h2 className="text-xl font-semibold mb-4 text-sky-700">📝 Edit Sale</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Customer Name"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="text"
            name="product"
            value={formData.product}
            onChange={handleChange}
            placeholder="Product"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity (kg)"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="number"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            placeholder="Rate ₹ per kg"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="date"
            name="saleDate"
            value={formData.saleDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Remarks"
            className="w-full border px-3 py-2 rounded"
          ></textarea>

          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded w-full"
          >
            ✅ Update Sale
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditSales;
// src/components/sales/SalesForm.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../layout/Layout';

const SalesForm = () => {
  const [customers, setCustomers] = useState([]);
  const [saleData, setSaleData] = useState({
    clientId: '',
    customerName: '',
    product: '',
    quantity: '',
    rate: '',
    saleDate: new Date().toISOString().split('T')[0],
    remarks: ''
  });

  // 🔷 Fetch customers from backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/customers/all');
        setCustomers(res.data);
      } catch (err) {
        console.error('❌ Error fetching customers:', err);
      }
    };
    fetchCustomers();
  }, []);

  // 🔷 Handle input change
  const handleChange = (e) => {
    setSaleData({ ...saleData, [e.target.name]: e.target.value });
  };

  // 🔷 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { clientId, product, quantity, rate } = saleData;
    if (!clientId || !product || !quantity || !rate) {
      alert("Please fill all required fields.");
      return;
    }

    // Find selected customer name
    const selectedCustomer = customers.find(c => c._id === clientId);

    try {
      await axios.post('http://localhost:5000/api/sales/add', {
        ...saleData,
        quantity: Number(quantity),
        rate: Number(rate),
        customerName: selectedCustomer?.name || ''
      });

      alert('✅ Sale added successfully!');
      setSaleData({
        clientId: '',
        customerName: '',
        product: '',
        quantity: '',
        rate: '',
        saleDate: new Date().toISOString().split('T')[0],
        remarks: ''
      });
    } catch (err) {
      console.error('❌ Failed to add sale:', err);
      alert('❌ Failed to add sale');
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-8 bg-white shadow p-6 rounded">
        <h2 className="text-xl font-semibold mb-4 text-sky-700">➕ Add New Sale</h2>
        <a href="/add-customer" className="text-sm text-blue-600 hover:underline">+ Add New Customer</a>


        <form onSubmit={handleSubmit} className="space-y-4">

          {/* 🔶 Customer Dropdown */}
          <select
            name="clientId"
            value={saleData.clientId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          {/* 🔶 Product */}
          <input
            type="text"
            name="product"
            value={saleData.product}
            onChange={handleChange}
            placeholder="Product"
            className="w-full border px-3 py-2 rounded"
            required
          />

          {/* 🔶 Quantity */}
          <input
            type="number"
            name="quantity"
            value={saleData.quantity}
            onChange={handleChange}
            placeholder="Quantity (kg)"
            className="w-full border px-3 py-2 rounded"
            required
          />

          {/* 🔶 Rate */}
          <input
            type="number"
            name="rate"
            value={saleData.rate}
            onChange={handleChange}
            placeholder="Rate ₹ per kg"
            className="w-full border px-3 py-2 rounded"
            required
          />

          {/* 🔶 Sale Date */}
          <input
            type="date"
            name="saleDate"
            value={saleData.saleDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          {/* 🔶 Remarks */}
          <textarea
            name="remarks"
            value={saleData.remarks}
            onChange={handleChange}
            placeholder="Remarks"
            className="w-full border px-3 py-2 rounded"
          ></textarea>

          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded w-full"
          >
            ➕ Add Sale
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default SalesForm;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const SalesInvoice = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/sales/${id}`);
        setSale(res.data);
      } catch (err) {
        console.error('Error fetching invoice:', err.message);
      }
    };
    if (id) fetchSale();
  }, [id]);

  const downloadPDF = () => {
    const input = document.getElementById('invoice');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10);
      pdf.save(`Sales-Invoice-${id.slice(-6).toUpperCase()}.pdf`);
    });
  };

  if (!sale) return <div className="p-10">Loading...</div>;

  const {
    customerName,
    product,
    quantity,
    rate,
    amount,
    remarks,
    saleDate
  } = sale;

  return (
    <div id="invoice" className="max-w-4xl mx-auto bg-white shadow p-6 sm:p-10 mt-10 rounded-lg border-l-8 border-green-700 font-[Outfit]">
      <div className="flex flex-col sm:flex-row justify-between border-b-2 border-green-700 pb-4 mb-4">
        <div>
          <h2 className="text-3xl font-bold text-green-700">KT TRADERS</h2>
          <p className="text-sm text-gray-600">Cold Storage & Aloo Supply Experts</p>
        </div>
        <div className="text-sm mt-4 sm:mt-0 text-gray-700 text-right">
          <p><strong>Invoice No:</strong> SALE-{id.slice(-6).toUpperCase()}</p>
          <p><strong>Date:</strong> {new Date(saleDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mb-6 text-sm text-gray-700">
        <p><strong>Client:</strong> {customerName || 'N/A'}</p>
        <p><strong>Remarks:</strong> {remarks || 'N/A'}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Product</th>
              <th className="p-2">Quantity (kg)</th>
              <th className="p-2">Rate (₹)</th>
              <th className="p-2">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center text-gray-700">
              <td className="p-2">1</td>
              <td className="p-2">{product}</td>
              <td className="p-2">{quantity} kg</td>
              <td className="p-2">₹{rate}</td>
              <td className="p-2 font-semibold">₹{amount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-right text-lg font-semibold text-green-700 mt-6">
        Total Payable: ₹{amount}
      </div>

      <div className="mt-10 text-sm text-gray-600 border-t pt-6">
        <p>Thank you for your business!</p>
        <p>This invoice is computer-generated and doesn't require a signature.</p>
        <p className="mt-6 text-right text-gray-700">
          <strong>Authorized Signature: _______________________</strong>
        </p>
      </div>

      <div className="mt-10 text-center print:hidden flex flex-col gap-3">
        <button
          onClick={() => window.print()}
          className="bg-green-700 text-white py-2 px-6 rounded hover:bg-green-800"
        >
          🖨️ Print Invoice
        </button>
        <button
          onClick={downloadPDF}
          className="bg-indigo-700 text-white py-2 px-6 rounded hover:bg-indigo-800"
        >
          📄 Download PDF
        </button>
      </div>
    </div>
  );
};

export default SalesInvoice;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaDownload, FaPrint, FaEdit } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const navigate = useNavigate();

  useEffect(() => {
    fetchSales();
  }, [page, limit, sortBy, sortOrder]);

  const fetchSales = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/sales/all?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${sortOrder}`);
      const formatted = res.data.sales.map((s) => ({
  ...s,
  clientName: s.customerName,              // ✅ FIXED
  product: s.product,                       // ✅ FIXED
  quantity: s.quantity,                     // ✅ FIXED
  rate: s.rate,                             // ✅ FIXED
  total: s.amount,                          // ✅ FIXED
  date: new Date(s.saleDate).toLocaleDateString('en-IN'),
}));

      setSales(formatted);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Error fetching sales:', err.message);
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(sales);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales');
    XLSX.writeFile(wb, 'Sales_Report.xlsx');
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/sales/${id}`);
        setSales((prev) => prev.filter((s) => s._id !== id));
        MySwal.fire('Deleted!', 'Sale has been deleted.', 'success');
      } catch (err) {
        console.error('Delete error:', err);
        MySwal.fire('Error!', 'Failed to delete sale.', 'error');
      }
    }
  };

  const filteredSales = sales.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.clientName.toLowerCase().includes(query) ||
      item.product.toLowerCase().includes(query) ||
      item.date.toLowerCase().includes(query)
    );
  });

  return (
    <Layout>
      <div className="mt-16 bg-gray-50 min-h-screen max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4 text-sky-700">📋 Sales List</h2>

        <div className="flex justify-between mb-4 gap-4">
          <input
            type="text"
            placeholder="Search client, product, date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button onClick={handleExport} className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
            <FaDownload className="inline mr-1" /> Excel
          </button>
          <button onClick={() => window.print()} className="bg-sky-600 text-white px-3 py-2 rounded hover:bg-sky-700">
            <FaPrint className="inline mr-1" /> Print
          </button>
        </div>

        <div className="overflow-auto rounded shadow bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-sky-100 text-sky-800">
              <tr>
                <th className="p-3">Client</th>
                <th className="p-3">Product</th>
                <th className="p-3">Qty (kg)</th>
                <th className="p-3">Rate (₹)</th>
                <th className="p-3">Total (₹)</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length > 0 ? (
                filteredSales.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-3">{item.clientName}</td>
                    <td className="p-3">{item.product}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">₹{item.rate}</td>
                    <td className="p-3 font-medium">₹{item.total}</td>
                    <td className="p-3">{item.date}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => navigate(`/edit-sale/${item._id}`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded"
                      >
                        <FaEdit className="inline" /> Edit
                      </button>
                      <button
                        onClick={() => window.open(`/sales-invoice/${item._id}`, '_blank')
}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded"
                      >
                        🧾 Invoice
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">No sales found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default SalesList;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FaDownload, FaPrint } from 'react-icons/fa';
import Layout from '../layout/Layout';

const SalesReport = () => {
  const [sales, setSales] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');

  // ✅ Fetch Customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers/all');
        console.log("Fetched Customers:", res.data);
      setCustomerList(res.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  // ✅ Fetch Sales Report
  const fetchReport = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sales/report', {
        params: { fromDate, toDate, customer: selectedCustomer },
      });
      console.log("Fetched Sales:", res.data);
      setSales(res.data);
    } catch (err) {
      console.error('Failed to fetch report:', err);
    }
  };

  // ✅ Excel Export
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(sales.map((s) => ({
      Date: new Date(s.saleDate).toLocaleDateString('en-IN'),
      Customer: s.clientId?.name || '',
      Product: s.product,
      Quantity: s.quantity,
      Rate: s.rate,
      Total: s.quantity * s.rate,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales_Report');
    XLSX.writeFile(wb, 'Sales_Report.xlsx');
  };

  // ✅ Set default date + fetch customer
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFromDate(today);
    setToDate(today);
    fetchCustomers();
  }, []);

  return (
    <Layout>
      <div className="mt-16 px-4 py-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
        <h1 className="text-xl font-bold text-sky-800 mb-4">📊 Sales Report</h1>

        {/* 🔶 Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 rounded shadow mb-6">
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border p-2 rounded" />
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border p-2 rounded" />
          <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} className="border p-2 rounded">
            <option value="">All Customers</option>
            {customerList.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full">
              <FaDownload className="inline mr-1" /> Excel
            </button>
            <button onClick={() => window.print()} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded w-full">
              <FaPrint className="inline mr-1" /> Print
            </button>
          </div>
        </div>

        {/* 🔷 Table */}
        <div className="overflow-auto bg-white shadow rounded">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-sky-100 text-sky-800">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Qty (kg)</th>
                <th className="p-3 text-left">Rate (₹)</th>
                <th className="p-3 text-left">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {sales.length > 0 ? (
                sales.map((s, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-3">{new Date(s.saleDate).toLocaleDateString('en-IN')}</td>
                    <td className="p-3">{s.clientId?.name || 'N/A'}</td>
                    <td className="p-3">{s.product}</td>
                    <td className="p-3">{s.quantity}</td>
                    <td className="p-3">₹{s.rate}</td>
                    <td className="p-3 font-semibold">₹{s.quantity * s.rate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default SalesReport;
import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AddStorage = () => {
  const [form, setForm] = useState({
    farmerId: '',
    product: '',
    quantity: '',
    room: '',
    rate: '',
    storageDate: new Date().toISOString().split('T')[0],
    outDate: '',
    remarks: ''
  });

  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingFarmers, setFetchingFarmers] = useState(true);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // 🔹 Fetch all farmers
  useEffect(() => {
    setFetchingFarmers(true);
    axios.get('http://localhost:5000/api/farmers/all')
      .then(res => {
        setFarmers(res.data);
        setFetchingFarmers(false);
      })
      .catch(err => {
        console.error('❌ Farmer fetch error:', err);
        setNotification({
          show: true,
          type: 'error',
          message: 'Failed to load farmers. Please refresh and try again.'
        });
        setFetchingFarmers(false);
      });
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Optional Validation
    if (!form.rate || Number(form.rate) <= 0) {
      setNotification({
        show: true,
        type: 'error',
        message: '❌ Please enter a valid rate per kg/day.'
      });
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/storage/add', form);
      setNotification({
        show: true,
        type: 'success',
        message: '✅ Storage Entry Added Successfully!'
      });
      setForm({
        farmerId: '',
        product: '',
        quantity: '',
        room: '',
        rate: '',
        storageDate: new Date().toISOString().split('T')[0],
        outDate: '',
        remarks: ''
      });
      
      // Auto hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
    } catch (err) {
      console.error('❌ Error adding storage entry:', err);
      setNotification({
        show: true,
        type: 'error',
        message: '❌ Failed to add storage entry: ' + (err.response?.data?.message || 'Unknown error')
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl mx-auto my-2 sm:my-4 px-3 sm:px-4"
      >
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-white">➕ Add Storage Entry</h2>
              <Link 
                to="/storage-list" 
                className="text-sm bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1.5 rounded-md transition-all flex items-center justify-center gap-1 w-max"
              >
                📋 View List
              </Link>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-6">
            {/* Notification Banner */}
            {notification.show && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 p-3 rounded-md text-sm ${
                  notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {notification.message}
                <button 
                  onClick={() => setNotification({ show: false, type: '', message: '' })} 
                  className="float-right text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 👤 Farmer Dropdown */}
              <div className="space-y-1">
                <label htmlFor="farmerId" className="text-sm font-medium text-gray-700">👤 Select Farmer</label>
                <select
                  id="farmerId"
                  name="farmerId"
                  value={form.farmerId}
                  onChange={handleChange}
                  disabled={fetchingFarmers}
                  className={`w-full border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors ${
                    fetchingFarmers ? 'bg-gray-100 cursor-wait' : ''
                  }`}
                  required
                >
                  <option value="">Select a farmer</option>
                  {farmers.map(f => (
                    <option key={f._id} value={f._id}>
                      {f.name} ({f.phone})
                    </option>
                  ))}
                </select>
                {fetchingFarmers && (
                  <p className="text-xs text-gray-500 mt-1">Loading farmers...</p>
                )}
              </div>

              {/* Grid for smaller fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 📦 Product */}
                <div className="space-y-1">
                  <label htmlFor="product" className="text-sm font-medium text-gray-700">📦 Product</label>
                  <input
                    id="product"
                    type="text"
                    name="product"
                    value={form.product}
                    onChange={handleChange}
                    placeholder="Product Name"
                    className="w-full border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                    required
                  />
                </div>

                {/* ⚖️ Quantity */}
                <div className="space-y-1">
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-700">⚖️ Quantity (kg)</label>
                  <input
                    id="quantity"
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    className="w-full border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                    required
                  />
                </div>

                {/* ❄️ Room */}
                <div className="space-y-1">
                  <label htmlFor="room" className="text-sm font-medium text-gray-700">❄️ Cold Room</label>
                  <select
                    id="room"
                    name="room"
                    value={form.room}
                    onChange={handleChange}
                    className="w-full border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                    required
                  >
                    <option value="">Select room</option>
                    <option value="Room-1">Room-1</option>
                    <option value="Room-2">Room-2</option>
                    <option value="Room-3">Room-3</option>
                  </select>
                </div>

                {/* 💰 Rate */}
                <div className="space-y-1">
                  <label htmlFor="rate" className="text-sm font-medium text-gray-700">💰 Rate (₹/kg/day)</label>
                  <input
                    id="rate"
                    type="number"
                    name="rate"
                    value={form.rate}
                    onChange={handleChange}
                    placeholder="Enter rate"
                    className="w-full border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                    step="0.01"
                    required
                  />
                </div>

                {/* 📅 Storage Date */}
                <div className="space-y-1">
                  <label htmlFor="storageDate" className="text-sm font-medium text-gray-700">📅 Storage Date</label>
                  <input
                    id="storageDate"
                    type="date"
                    name="storageDate"
                    value={form.storageDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                    required
                  />
                </div>

                {/* 📅 Out Date */}
                <div className="space-y-1">
                  <label htmlFor="outDate" className="text-sm font-medium text-gray-700">📅 Expected Out Date</label>
                  <input
                    id="outDate"
                    type="date"
                    name="outDate"
                    value={form.outDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional</p>
                </div>
              </div>

              {/* 📝 Remarks */}
              <div className="space-y-1">
                <label htmlFor="remarks" className="text-sm font-medium text-gray-700">📝 Remarks</label>
                <textarea
                  id="remarks"
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  placeholder="Additional notes (optional)"
                  className="w-full border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 py-2 rounded-md text-sm sm:text-base transition-colors"
                  rows="3"
                ></textarea>
              </div>

              {/* ✅ Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full transition-colors flex items-center justify-center gap-2 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  '✅ Submit'
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default AddStorage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../layout/Layout';
import axios from 'axios';

const EditStorage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    farmerId: '',
    product: '',
    quantity: '',
    room: '',
    rate: '',
    storageDate: '',
    outDate: '',
    remarks: ''
  });

  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    // 🔹 Fetch Storage Entry
    axios.get(`http://localhost:5000/api/storage/${id}`)
      .then(res => setForm(res.data))
      .catch(err => console.error('❌ Fetch error:', err));

    // 🔹 Fetch Farmer List
    axios.get('http://localhost:5000/api/farmers/all')
      .then(res => setFarmers(res.data))
      .catch(err => console.error('❌ Farmer fetch error:', err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/storage/update/${id}`, form);
      alert('✅ Updated successfully');
      navigate('/storage-list');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update entry');
    }
  };

  return (
    <Layout>
      <div className="mt-16 px-4 py-6 max-w-xl mx-auto bg-white shadow-md rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-yellow-700">✏️ Edit Storage Entry</h2>
          <Link to="/storage-list" className="text-sm text-blue-600 hover:underline">📋 Back to List</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <select name="farmerId" value={form.farmerId} onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">👤 Select Farmer</option>
            {farmers.map(f => (
              <option key={f._id} value={f._id}>{f.name} ({f.phone})</option>
            ))}
          </select>

          <input type="text" name="product" value={form.product} onChange={handleChange}
            placeholder="Product" className="w-full border p-2 rounded" required />

          <input type="number" name="quantity" value={form.quantity} onChange={handleChange}
            placeholder="Quantity (kg)" className="w-full border p-2 rounded" required />

          <input type="text" name="room" value={form.room} onChange={handleChange}
            placeholder="Room" className="w-full border p-2 rounded" />

          <input type="number" name="rate" value={form.rate} onChange={handleChange}
            placeholder="Rate ₹/kg/day" className="w-full border p-2 rounded" />

          <input type="date" name="storageDate" value={form.storageDate?.substring(0, 10)} onChange={handleChange}
            className="w-full border p-2 rounded" />

          <input type="date" name="outDate" value={form.outDate?.substring(0, 10)} onChange={handleChange}
            className="w-full border p-2 rounded" />

          <textarea name="remarks" value={form.remarks} onChange={handleChange}
            placeholder="Remarks" className="w-full border p-2 rounded" />

          <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded">
            ✅ Update
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditStorage;
import React from 'react';

const PrintViewModal = ({ entry, onClose }) => {
  if (!entry) return null;

  const calculateDays = (inDate, outDate) => {
    const start = new Date(inDate);
    const end = outDate ? new Date(outDate) : new Date();
    const diff = Math.abs(end - start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const days = calculateDays(entry.storageDate, entry.outDate);
  const total = entry.quantity * entry.rate * days;

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center print:bg-white print:block">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl print:w-full print:shadow-none print:rounded-none font-sans text-gray-800">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-green-700">🧾 Invoice</h2>
            <p className="text-sm text-gray-600">Cold Storage Management System</p>
          </div>
          <div className="text-sm text-right space-y-1">
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Invoice #:</strong> {entry._id.slice(-6).toUpperCase()}</p>
          </div>
        </div>

        {/* Farmer Info */}
        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-700 mb-2">👤 Farmer Details</h3>
          <div className="text-sm space-y-1">
            <p><strong>Name:</strong> {entry.farmerId?.name}</p>
            <p><strong>Phone:</strong> {entry.farmerId?.phone}</p>
            <p><strong>Email:</strong> {entry.farmerId?.email || '—'}</p>
            <p><strong>Address:</strong> {entry.farmerId?.address || '—'}</p>
          </div>
        </div>

        {/* Storage Summary */}
        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-700 mb-2">📦 Storage Summary</h3>
          <table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
            <thead className="bg-green-100 text-green-800">
              <tr>
                {['Product', 'Qty (kg)', 'Rate ₹/kg/day', 'In Date', 'Out Date', 'Days', 'Total ₹'].map((th) => (
                  <th key={th} className="p-2 border">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="p-2 border">{entry.product}</td>
                <td className="p-2 border">{entry.quantity}</td>
                <td className="p-2 border">{entry.rate}</td>
                <td className="p-2 border">{new Date(entry.storageDate).toLocaleDateString()}</td>
                <td className="p-2 border">{entry.outDate ? new Date(entry.outDate).toLocaleDateString() : '—'}</td>
                <td className="p-2 border">{days}</td>
                <td className="p-2 border font-bold text-green-700">₹{total}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Remarks */}
        <div className="text-sm mb-4">
          <p><strong>Remarks:</strong> {entry.remarks || '—'}</p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4 print:hidden">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            ✖ Close
          </button>
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            🖨️ Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintViewModal;
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
import React, { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StorageFilterBar from './StorageFilterBar';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import PrintViewModal from './PrintViewModal';

const StorageList = () => {
  const [storage, setStorage] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/storage/all')
      .then(res => setStorage(res.data))
      .catch(err => console.error('Storage fetch error:', err));
  }, []);

  const [filters, setFilters] = useState({
    farmer: '',
    product: '',
    status: '',
    fromDate: '',
    toDate: ''
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredStorage = storage.filter((item) => {
    const nameMatch = item.farmerId?.name.toLowerCase().includes(filters.farmer.toLowerCase());
    const productMatch = item.product.toLowerCase().includes(filters.product.toLowerCase());
    const statusMatch =
      filters.status === '' ||
      (filters.status === 'in' && !item.outDate) ||
      (filters.status === 'out' && item.outDate);

    const inDate = new Date(item.storageDate);
    const from = filters.fromDate ? new Date(filters.fromDate) : null;
    const to = filters.toDate ? new Date(filters.toDate) : null;

    const dateMatch = (!from || inDate >= from) && (!to || inDate <= to);

    return nameMatch && productMatch && statusMatch && dateMatch;
  });

  const calculateDays = (inDate, outDate) => {
    const start = new Date(inDate);
    const end = outDate ? new Date(outDate) : new Date();
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const summary = filteredStorage.reduce((acc, item) => {
    const days = calculateDays(item.storageDate, item.outDate);
    const total = (item.quantity || 0) * (item.rate || 0) * days;
    acc.totalQty += Number(item.quantity || 0);
    acc.totalIncome += total;
    acc.totalEntries += 1;
    return acc;
  }, { totalQty: 0, totalIncome: 0, totalEntries: 0 });

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredStorage);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Storage Data');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'storage_data.xlsx');
  };
  const [printEntry, setPrintEntry] = useState(null);
    const handlePrint = (entry) => {
        setPrintEntry(entry);
    };

  

  return (
    <Layout>
      <div className="mt-16 px-4 py-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h1 className="text-xl font-bold text-green-800">📦 Storage Entries</h1>
          <StorageFilterBar filters={filters} onChange={handleFilterChange} />
          <Link
            to="/add-storage"
            className="text-sm text-blue-600 hover:underline whitespace-nowrap"
          >
            ➕ Add New Entry
          </Link>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={handleExportExcel}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded shadow"
          >
            📤 Export Excel
          </button>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-green-100 text-green-800">
              <tr>
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Farmer</th>
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-left">Qty (kg)</th>
                <th className="p-2 text-left">In Date</th>
                <th className="p-2 text-left">Out Date</th>
                <th className="p-2 text-left">Room</th>
                <th className="p-2 text-left">Rate ₹</th>
                <th className="p-2 text-left">Days</th>
                <th className="p-2 text-left">Total ₹</th>
                <th className="p-2 text-left">Remarks</th>
                <th className="p-2 text-left">Actions</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {storage.length > 0 ? (
                filteredStorage.map((s, i) => {
                  const days = calculateDays(s.storageDate, s.outDate);
                  const total = (s.quantity || 0) * (s.rate || 0) * days;
                  const status = s.outDate ? 'Out' : 'In';

                  return (
                    <tr key={s._id} className="border-t hover:bg-gray-50">
                      <td className="p-2">{i + 1}</td>
                      <td className="p-2">{s.farmerId?.name || '-'}</td>
                      <td className="p-2">{s.product}</td>
                      <td className="p-2">{s.quantity}</td>
                      <td className="p-2">{new Date(s.storageDate).toLocaleDateString()}</td>
                      <td className="p-2">{s.outDate ? new Date(s.outDate).toLocaleDateString() : '—'}</td>
                      <td className="p-2">{s.room || '—'}</td>
                      <td className="p-2">{s.rate || 0}</td>
                      <td className="p-2">{days}</td>
                      <td className="p-2 font-semibold text-green-700">₹{total}</td>
                      <td className="p-2">{s.remarks || '-'}</td>
                      <td className="p-2 space-y-1 flex flex-col sm:flex-row gap-1">
                        <Link
                          to={`/edit-storage/${s._id}`}
                          className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        >
                          ✏️ Edit
                        </Link>
                        <button
  onClick={() => {
    if (window.confirm('❌ Delete this entry?')) {
      axios.delete(`http://localhost:5000/api/storage/${s._id}`)
        .then(() => {
          alert('✅ Deleted successfully');
          setStorage(prev => prev.filter(item => item._id !== s._id));
        })
        .catch(() => alert('❌ Delete failed'));
    }
  }}
  className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
>
  🗑️ Delete
</button>
                        <button
  onClick={() => setPrintEntry(s)}
  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
>
  🖨️ Print
</button>

                      </td>
                        <td className="p-2">
                            <span className={`px-2 py-1 rounded text-xs ${s.outDate ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {status}
                            </span>
                        </td>
                    </tr>
                    );
                }
                )
                ) : (
                <tr>
                  <td colSpan="13" className="p-4 text-center text-gray-500">
                    No storage entries found
                  </td>
                </tr>
                )}
            </tbody>
            </table>
            <div className="p-4 bg-gray-50">
                <h2 className="text-lg font-semibold text-green-800">Summary</h2>
                <p>Total Entries: {summary.totalEntries}</p>
                <p>Total Quantity: {summary.totalQty} kg</p>
                <p>Total Income: ₹{summary.totalIncome.toFixed(2)}</p>
            </div>
            </div>
        </div>
        <PrintViewModal entry={printEntry} onClose={() => setPrintEntry(null)} />

        </Layout>
    );
}
export default StorageList;import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../components/layout/Layout';

const StockForm = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    type: 'in', // 'in' for addition, 'out' for subtraction
    remarks: ''
  });

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/stock/manual', formData);
      alert('Stock updated successfully!');
      setFormData({ itemName: '', quantity: '', type: 'in', remarks: '' });
    } catch (err) {
      console.error('Error updating stock:', err);
      alert('Failed to update stock');
    }
  };

  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 text-green-700">📦 Manual Stock Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="itemName" value={formData.itemName} onChange={handleChange}
          placeholder="Item Name" className="w-full border p-2 rounded" required />

        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange}
          placeholder="Quantity (in kg)" className="w-full border p-2 rounded" required />

        <select name="type" value={formData.type} onChange={handleChange}
          className="w-full border p-2 rounded">
          <option value="in">Stock In (Add)</option>
          <option value="out">Stock Out (Remove)</option>
        </select>

        <input type="text" name="remarks" value={formData.remarks} onChange={handleChange}
          placeholder="Remarks (optional)" className="w-full border p-2 rounded" />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          ✅ Submit
        </button>
      </form>
    </div>
    </Layout>
  );
};

export default StockForm;
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
        const res = await axios.get(`http://localhost:5000/api/stock/history/${itemName}`);
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

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { CSVLink } from 'react-csv';

const StockList = () => {
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/stock/list');
        if (Array.isArray(res.data)) {
          setStockList(res.data);
        } else {
          setError('Invalid response format from server.');
        }
      } catch (err) {
        console.error('❌ Error fetching stock list:', err.message);
        setError('Failed to fetch stock list. Server may be down.');
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  const filteredStock = stockList.filter((item) =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStock.length / itemsPerPage);
  const paginatedStock = filteredStock.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Layout>
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg max-w-6xl mx-auto mt-6">
        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
          📦 Current Stock List
        </h2>

        {/* 🔍 Search Filter + Export */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <input
            type="text"
            placeholder="🔍 Search item name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <CSVLink
            data={filteredStock}
            filename="stock-list.csv"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm shadow"
          >
            ⬇️ Export CSV
          </CSVLink>
        </div>

        {/* 📱 Mobile Card View */}
        <div className="md:hidden space-y-4">
          {paginatedStock.map((stock, idx) => (
            <div
              key={idx}
              className={`border p-4 rounded shadow ${
                stock.currentStock < 100 ? 'bg-red-50' : 'bg-gray-50'
              }`}
            >
              <p className="font-bold text-gray-700">📌 {stock.itemName}</p>
              <p className="text-green-700 font-medium">
                In: +{stock.totalIn || 0}
              </p>
              <p className="text-red-700 font-medium">
                Out: -{stock.totalOut || 0}
              </p>
              <p
                className={`font-bold ${
                  stock.currentStock < 100
                    ? 'text-red-700'
                    : 'text-gray-800'
                }`}
              >
                Stock: {stock.currentStock || 0}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(stock.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* 💻 Desktop Table View */}
        {!loading && !error && filteredStock.length > 0 && (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm border border-collapse">
              <thead className="bg-green-100 text-gray-700">
                <tr>
                  <th className="p-2 border">Item Name</th>
                  <th className="p-2 border">Total In</th>
                  <th className="p-2 border">Total Out</th>
                  <th className="p-2 border">Current Stock</th>
                  <th className="p-2 border">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStock.map((stock, idx) => (
                  <tr
                    key={idx}
                    className={`text-center ${
                      stock.currentStock < 100 ? 'bg-red-50' : 'bg-white'
                    }`}
                  >
                    <td className="border p-2">{stock.itemName}</td>
                    <td className="border p-2 text-green-700 font-bold">
                      +{stock.totalIn || 0}
                    </td>
                    <td className="border p-2 text-red-700 font-bold">
                      -{stock.totalOut || 0}
                    </td>
                    <td
                      className={`border p-2 font-bold ${
                        stock.currentStock < 100
                          ? 'text-red-700'
                          : 'text-gray-800'
                      }`}
                    >
                      {stock.currentStock || 0}
                    </td>
                    <td className="border p-2 text-sm text-gray-500">
                      {new Date(stock.lastUpdated).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredStock.length > itemsPerPage && (
          <div className="mt-4 flex justify-center items-center space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              ⬅️ Prev
            </button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next ➡️
            </button>
          </div>
        )}

        {/* Error / Loading */}
        {loading && <p className="text-center mt-2">⏳ Loading stock...</p>}
        {error && <p className="text-center text-red-600 mt-2">{error}</p>}
        {!loading && filteredStock.length === 0 && !error && (
          <p className="text-center text-gray-500 mt-2">No stock found</p>
        )}
      </div>
    </Layout>
  );
};

export default StockList;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/admin/AdminLogin';
import OTPVerify from './components/admin/OTPVerify';
import Dashboard from './components/admin/Dashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AddFarmer from './components/farmers/AddFarmer';

import FarmerList from './components/farmers/FarmerList';
import EditFarmer from './components/farmers/EditFarmer';
import FarmerLedger from './components/farmers/FarmerLedger';




import AddPayment from './components/payments/AddPayment';

import PurchaseList from './components/purchases/PurchaseList';
import AddPurchase from './components/purchases/AddPurchase';

import InvoicePage from "./components/purchases/InvoicePage";
import EditPurchase from './components/purchases/EditPurchase';
import ReportPage from './components/purchases/ReportPage';


import SalesEntry from './components/Sales/SalesForm'; // ✅ for Sales
import SalesInvoice from './components/Sales/SalesInvoice'; // ✅ for Sales
import SalesList from './components/Sales/SalesList'; // ✅ for Sales
import SalesReport from './components/Sales/SalesReport'; // ✅ for Sales
import EditSale from './components/Sales/EditSales'; // ✅ for Sales
import AddCustomer from './components/Sales/AddCustomer'; // ✅ for Sales
import CustomerList from './components/Sales/CustomerList'; // ✅ for Sales
import EditCustomer from './components/Sales/EditCustomer'; // ✅ for Sales



import AddStorage from "./components/storage/AddStorage"; 
import StorageList from "./components/storage/StorageList";
import EditStorage from "./components/storage/EditStorage"; // ✅ for Storage

import ManualStockForm from "./pages/StockForm";

import StockList from './pages/StockList';
import StockHistory from './pages/StockHistory';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/otp" element={<OTPVerify />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/add-farmer" element={<AddFarmer />} />
        <Route path="/farmers" element={<FarmerList />} />
        <Route path="/ledger/:farmerId" element={<FarmerLedger />} />
        

        

        <Route path="/add-payment/:farmerId" element={<AddPayment />} />
      
        <Route path="/edit-farmer/:id" element={<EditFarmer />} />
        <Route path="/purchase-entry" element={<AddPurchase />} />

        <Route path="/purchase-list" element={<PurchaseList />} />
       
        <Route path="/invoice/:id" element={<InvoicePage />} />
       

       <Route path="/edit-purchase/:id" element={<EditPurchase />} />
      
       <Route path="/report" element={<ReportPage />} />




       {/* ✅ Sales Routes */}
            <Route path="/sales-entry" element={<SalesEntry />} />
            <Route path="/sales-list" element={<SalesList />} />
            <Route path="/sales-report" element={<SalesReport />} />
            <Route path="/sales-invoice/:id" element={<SalesInvoice />} />
            <Route path="/edit-sale/:id" element={<EditSale />} /> // ✅ Add this

            <Route path="/add-customer" element={<AddCustomer />} />
            <Route path="/customer-list" element={<CustomerList />} />
            <Route path="/edit-customer/:id" element={<EditCustomer />} />


            {/* Storage Module */}
          <Route path="/add-storage" element={<AddStorage />} />
          <Route path="/storage-list" element={<StorageList />} />
          <Route path="/edit-storage/:id" element={<EditStorage />} />


        <Route path="/stock-form" element={<ManualStockForm />} />
        <Route path="/stock-list" element={<StockList />} />
        <Route path="/stock-history" element={<StockHistory />} />











        

      </Routes>
    </Router>
  );
};

export default App;
