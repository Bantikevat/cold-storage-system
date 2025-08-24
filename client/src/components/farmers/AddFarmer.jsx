// src/components/farmers/AddFarmer.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../layout/Layout"; // Assuming you have a Layout component
import { Link, useNavigate } from "react-router-dom"; // useNavigate added
import axios from "axios"; // axios added
import API_ENDPOINTS from "../../config/api";

const AddFarmer = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    aadhaar: "",
    email: "",
    // preferredRoom removed
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const navigate = useNavigate(); // useNavigate hook

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ show: false, type: "", message: "" }); // Clear previous notifications

    try {
      const res = await axios.post(API_ENDPOINTS.FARMERS_ADD, formData); // Using axios

      if (res.status === 201) {
        // Check for 201 Created status
        setNotification({
          show: true,
          type: "success",
          message: "✅ Farmer added successfully!",
        });
        setFormData({
          // Reset form
          name: "",
          phone: "",
          address: "",
          aadhaar: "",
          email: "",
        });
        // Auto hide notification after 5 seconds and navigate
        setTimeout(() => {
          setNotification({ show: false, type: "", message: "" });
          navigate("/farmers"); // Navigate to farmer list after success
        }, 2000); // Reduced delay for quicker navigation
      } else {
        // This block might not be reached with axios if status is not 2xx
        setNotification({
          show: true,
          type: "error",
          message: `❌ Failed: ${res.data.message || "Unknown error occurred"}`,
        });
      }
    } catch (error) {
      console.error("Error adding farmer:", error);
      setNotification({
        show: true,
        type: "error",
        message: `❌ Error adding farmer: ${
          error.response?.data?.message || error.message || "Please try again."
        }`,
      });
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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-0">
            ➕ Add New Farmer
          </h2>
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
              notification.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {notification.message}
            <button
              onClick={() =>
                setNotification({ show: false, type: "", message: "" })
              }
              className="float-right text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Form Card */}
        <motion.div
          whileHover={{
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.06)",
          }}
          transition={{ duration: 0.2 }}
          className="bg-white p-5 sm:p-8 rounded-2xl shadow-md w-full max-w-4xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {/* Name Field */}
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  👤 Full Name
                </label>
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
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  📱 Phone Number
                </label>
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
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  🏠 Address
                </label>
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
                <label
                  htmlFor="aadhaar"
                  className="block text-sm font-medium text-gray-700"
                >
                  🆔 Aadhaar Number
                </label>
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
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  📧 Email
                </label>
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

              {/* preferredRoom field removed */}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center sm:justify-end pt-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-6 sm:px-8 rounded-xl text-base sm:text-lg font-semibold shadow-md transition-colors ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "✅ Save Farmer"
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
