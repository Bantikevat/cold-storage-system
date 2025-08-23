import React, { useState } from "react";
import axios from "axios";
import Layout from "../layout/Layout";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const AddCustomer = () => {
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for phone number - remove non-digit characters
    if (name === "phone") {
      const cleanedPhone = value.replace(/\D/g, "");
      setCustomerData({ ...customerData, [name]: cleanedPhone });
    } else {
      setCustomerData({ ...customerData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerData.name || !customerData.name.trim()) {
      MySwal.fire({
        icon: "warning",
        title: "Missing Information!",
        text: "Please enter the customer name.",
        confirmButtonColor: "#0369a1",
      });
      return;
    }

    if (!customerData.phone || customerData.phone.length < 10) {
      MySwal.fire({
        icon: "warning",
        title: "Invalid Phone Number!",
        text: "Please enter a valid 10-digit phone number.",
        confirmButtonColor: "#0369a1",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("Sending customer data:", customerData);

      const response = await axios.post(
        "https://cold-storage-system.onrender.com/api/customers/add",
        customerData
      );

      console.log("Customer added successfully:", response.data);

      MySwal.fire({
        icon: "success",
        title: "Success!",
        text: "Customer added successfully!",
        confirmButtonColor: "#0369a1",
      }).then(() => {
        setCustomerData({
          name: "",
          phone: "",
          email: "",
          address: "",
        });
        navigate("/customer-list");
      });
    } catch (err) {
      console.error("❌ Failed to add customer:", err);

      const errorMessage =
        err.response?.data?.message || err.message || "Something went wrong";

      MySwal.fire({
        icon: "error",
        title: "Error!",
        text: `Failed to add customer: ${errorMessage}`,
        confirmButtonColor: "#0369a1",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              👥 Add New Customer
            </h1>
            <p className="text-gray-600">
              Register a new customer in your system
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">
                📝 Customer Information
              </h2>
              <p className="text-blue-100">
                Please fill in all the customer details
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-6">
                {/* Basic Information */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">
                    👤 Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={customerData.name}
                        onChange={handleChange}
                        placeholder="Enter customer full name"
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={customerData.phone}
                        onChange={handleChange}
                        placeholder="Enter 10-digit phone number"
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={customerData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={customerData.address}
                        onChange={handleChange}
                        placeholder="Enter complete address"
                        rows="2"
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/customer-list")}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  ← Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-white font-semibold ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </div>
                  ) : (
                    "👥 Add Customer"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddCustomer;
