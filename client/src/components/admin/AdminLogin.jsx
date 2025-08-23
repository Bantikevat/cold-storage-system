// ✅ src/components/admin/AdminLogin.jsx (Part of MultipleFiles/demo.jsx)
import React, { useState, useEffect, useRef } from 'react'; // useRef is not used in AdminLogin, but kept for OTPVerify
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logos from "../../assets/image/logo.jpg"; // Make sure path is correct

// --- AdminLogin Component ---
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate();

  // Basic email validation regex
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendOTP = async () => {
    setError(''); // Clear previous errors

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      // Send email in the request body
      await axios.post('https://cold-storage-system-1s.onrender.com/api/otp/send-otp', { email });
      localStorage.setItem('adminEmail', email); // Store email for OTP verification
      navigate('/otp'); // Navigate to OTP verification page
    } catch (err) {
      console.error("Error sending OTP:", err);
      // Display a user-friendly error message
      setError('Failed to send OTP. Please check your email or try again later.');
      // You can add more specific error handling based on err.response.status
      // e.g., if (err.response && err.response.status === 404) setError('Email not found.');
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

          <label htmlFor="adminEmail" className="block mb-2 text-sm font-medium text-gray-600">
            Enter Admin Email
          </label>
          <input
            type="email"
            id="adminEmail"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 transition"
          />

          {/* Display error message if any */}
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

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

// Note: The OTPVerify component and the default export will follow this AdminLogin component
// within the same MultipleFiles/demo.jsx file.
// For the full file, please refer to the previous complete code block.


export default AdminLogin;
