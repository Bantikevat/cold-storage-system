import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../layout/Layout";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    gstin: "",
    creditLimit: "",
    remarks: ""
  });

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(
        `https://cold-storage-system.onrender.com/api/customers/${id}`
      );

      // ✅ Default values fix
      setCustomer({
        name: response.data.name || "",
        phone: response.data.phone || "",
        email: response.data.email || "",
        address: response.data.address || "",
        city: response.data.city || "",
        state: response.data.state || "",
        gstin: response.data.gstin || "",
        creditLimit: response.data.creditLimit || "",
        remarks: response.data.remarks || ""
      });
    } catch (error) {
      console.error("Error fetching customer:", error);
      MySwal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to fetch customer details",
        confirmButtonColor: "#0369a1",
      });
      navigate("/customer-list");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // ✅ Safe payload banaya
      const payload = {
        name: customer.name?.trim() || "",
        phone: customer.phone ? customer.phone.replace(/\D/g, "") : "",
        email: customer.email?.trim() || "",
        address: customer.address?.trim() || "",
        city: customer.city?.trim() || "",
        state: customer.state?.trim() || "",
        gstin: customer.gstin?.trim() || "",
        creditLimit: Number(customer.creditLimit) || 0,
        remarks: customer.remarks?.trim() || "",
      };

      await axios.put(
        `https://cold-storage-system.onrender.com/api/customers/update/${id}`,
        payload
      );

      MySwal.fire("✅ Success", "Customer updated successfully", "success");
      navigate("/customer-list");
    } catch (error) {
      console.error("❌ Update Error:", error.response?.data || error.message);
      MySwal.fire(
        "Error",
        error.response?.data?.message || "Failed to update customer",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <span className="ml-4 text-lg text-gray-600">
            Loading customer details...
          </span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              ✏️ Edit Customer
            </h1>
            <p className="text-gray-600">Update customer information</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
              <h2 className="text-2xl font-bold text-white">
                Customer Details
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  👤 Customer Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={customer.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📞 Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customer.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  pattern="[0-9]{10,15}"
                  maxLength="15"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📧 Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={customer.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📍 Address
                </label>
                <textarea
                  name="address"
                  value={customer.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🏙️ City
                </label>
                <input
                  type="text"
                  name="city"
                  value={customer.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🏠 State
                </label>
                <input
                  type="text"
                  name="state"
                  value={customer.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>

              {/* GSTIN */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🧾 GSTIN
                </label>
                <input
                  type="text"
                  name="gstin"
                  value={customer.gstin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>

              {/* Credit Limit */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💰 Credit Limit
                </label>
                <input
                  type="number"
                  name="creditLimit"
                  value={customer.creditLimit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📝 Remarks
                </label>
                <textarea
                  name="remarks"
                  value={customer.remarks}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/customer-list")}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl"
                >
                  ← Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl"
                >
                  {submitting ? "⏳ Updating..." : "✅ Update Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditCustomer;
