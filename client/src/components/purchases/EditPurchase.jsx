import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const EditPurchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    purchaseDate: "",
    coldStorage: "",
    vehicleNo: "",
    lotNo: "",
    transport: "",
    farmerId: "",
    variety: "",
    quality: "",
    bags: "",
    weightPerBag: "",
    ratePerKg: "",
    remarks: "",
  });
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState({
    coldStorage: ["KT Cold Storage", "ABC Cold Storage", "XYZ Cold Storage", "Premium Cold Storage"],
    vehicleNo: ["UP32AB1234", "UP32CD5678", "UP32EF9012", "UP32GH3456"],
    lotNo: ["LOT001", "LOT002", "LOT003", "LOT004", "LOT005"],
    transport: ["ABC Transport", "XYZ Logistics", "Premium Transport", "Fast Delivery"],
  });
  const [showSuggestions, setShowSuggestions] = useState({
    coldStorage: false,
    vehicleNo: false,
    lotNo: false,
    transport: false,
  });
  const suggestionRefs = {
    coldStorage: useRef(null),
    vehicleNo: useRef(null),
    lotNo: useRef(null),
    transport: useRef(null),
  };

  // Handle click outside suggestion boxes
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(suggestionRefs).forEach((field) => {
        if (
          suggestionRefs[field].current &&
          !suggestionRefs[field].current.contains(event.target)
        ) {
          setShowSuggestions((prev) => ({
            ...prev,
            [field]: false,
          }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch farmers list
        const farmersRes = await axios.get(
          "https://cold-storage-system.onrender.com/api/farmers/all?limit=1000"
        );
        setFarmers(farmersRes.data.farmers);

        // Fetch purchase details
        const purchaseRes = await axios.get(
          `https://cold-storage-system.onrender.com/api/purchases/${id}`
        );
        const purchaseData = purchaseRes.data.purchase;

        setFormData({
          purchaseDate: purchaseData.purchaseDate
            ? new Date(purchaseData.purchaseDate).toISOString().split("T")[0]
            : "",
          coldStorage: purchaseData.coldStorage || "",
          vehicleNo: purchaseData.vehicleNo || "",
          lotNo: purchaseData.lotNo || "",
          transport: purchaseData.transport || "",
          farmerId: purchaseData.farmerId?._id || "",
          variety: purchaseData.variety || "",
          quality: purchaseData.quality || "",
          bags: purchaseData.bags || "",
          weightPerBag: purchaseData.weightPerBag || "",
          ratePerKg: purchaseData.ratePerKg || "",
          remarks: purchaseData.remarks || "",
        });

        // Don't fetch suggestions from API, use default suggestions
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load purchase details or farmers list.");
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load purchase details.",
          confirmButtonColor: "#0369a1",
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue =
      name === "vehicleNo" || name === "lotNo" ? value.toUpperCase() : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });

    // Show suggestions when user starts typing in auto-fill fields
    if (
      ["coldStorage", "vehicleNo", "lotNo", "transport"].includes(name) &&
      newValue.length > 0
    ) {
      setShowSuggestions((prev) => ({
        ...prev,
        [name]: true,
      }));
    } else if (newValue.length === 0) {
      setShowSuggestions((prev) => ({
        ...prev,
        [name]: false,
      }));
    }

    // If farmer changes, suggestions remain the same (using defaults)
  };

  const handleSuggestionClick = (field, suggestion) => {
    setFormData((prev) => ({
      ...prev,
      [field]: suggestion,
    }));
    setShowSuggestions((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const handleInputFocus = (field) => {
    if (formData[field].length > 0) {
      setShowSuggestions((prev) => ({
        ...prev,
        [field]: true,
      }));
    }
  };

  // Calculate total weight and amount dynamically
  const totalWeight = (
    Number(formData.bags) * Number(formData.weightPerBag)
  ).toFixed(2);
  const amount = (totalWeight * Number(formData.ratePerKg)).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      bags: Number(formData.bags),
      weightPerBag: Number(formData.weightPerBag),
      ratePerKg: Number(formData.ratePerKg),
      totalWeight: parseFloat(totalWeight),
      amount: parseFloat(amount),
    };

    try {
      await axios.put(
        `https://cold-storage-system.onrender.com/api/purchases/${id}`,
        payload
      );
      MySwal.fire({
        icon: "success",
        title: "सफलता!",
        text: "Purchase updated successfully!",
        confirmButtonColor: "#0369a1",
      });
      navigate("/purchase-list");
    } catch (err) {
      console.error("Error updating purchase:", err.message);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to update purchase: ${
          err.response?.data?.message || err.message
        }`,
        confirmButtonColor: "#0369a1",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">
              Loading purchase details...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <p className="text-xl font-semibold text-gray-700">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              📝 Edit Purchase
            </h2>
            <p className="text-gray-600">Update purchase details</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Purchase Date */}
              <div className="group">
                <label
                  htmlFor="purchaseDate"
                  className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600"
                >
                  📅 Purchase Date *
                </label>
                <input
                  type="date"
                  id="purchaseDate"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300"
                />
              </div>

              {/* Cold Storage */}
              <div className="group relative">
                <label
                  htmlFor="coldStorage"
                  className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600"
                >
                  🏬 Cold Storage Name *
                </label>
                <input
                  type="text"
                  id="coldStorage"
                  name="coldStorage"
                  placeholder="e.g., KT Cold Storage"
                  value={formData.coldStorage}
                  onChange={handleChange}
                  onFocus={() => handleInputFocus("coldStorage")}
                  required
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300"
                />
                {showSuggestions.coldStorage &&
                  suggestions.coldStorage.length > 0 && (
                    <div
                      ref={suggestionRefs.coldStorage}
                      className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                      {suggestions.coldStorage.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() =>
                            handleSuggestionClick("coldStorage", suggestion)
                          }
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Vehicle Number */}
              <div className="group relative">
                <label
                  htmlFor="vehicleNo"
                  className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600"
                >
                  🚛 Vehicle Number *
                </label>
                <input
                  type="text"
                  id="vehicleNo"
                  name="vehicleNo"
                  placeholder="e.g., UP32AB1234"
                  value={formData.vehicleNo}
                  onChange={handleChange}
                  onFocus={() => handleInputFocus("vehicleNo")}
                  required
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 uppercase"
                />
                {showSuggestions.vehicleNo &&
                  suggestions.vehicleNo.length > 0 && (
                    <div
                      ref={suggestionRefs.vehicleNo}
                      className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                      {suggestions.vehicleNo.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() =>
                            handleSuggestionClick("vehicleNo", suggestion)
                          }
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Lot Number */}
              <div className="group relative">
                <label
                  htmlFor="lotNo"
                  className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600"
                >
                  🏷️ Lot Number *
                </label>
                <input
                  type="text"
                  id="lotNo"
                  name="lotNo"
                  placeholder="e.g., LOT001"
                  value={formData.lotNo}
                  onChange={handleChange}
                  onFocus={() => handleInputFocus("lotNo")}
                  required
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 uppercase"
                />
                {showSuggestions.lotNo && suggestions.lotNo.length > 0 && (
                  <div
                    ref={suggestionRefs.lotNo}
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  >
                    {suggestions.lotNo.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() =>
                          handleSuggestionClick("lotNo", suggestion)
                        }
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Transport */}
              <div className="group relative">
                <label
                  htmlFor="transport"
                  className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600"
                >
                  🚚 Transport Company *
                </label>
                <input
                  type="text"
                  id="transport"
                  name="transport"
                  placeholder="e.g., ABC Transport"
                  value={formData.transport}
                  onChange={handleChange}
                  onFocus={() => handleInputFocus("transport")}
                  required
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300"
                />
                {showSuggestions.transport && suggestions.transport.length > 0 && (
                  <div
                    ref={suggestionRefs.transport}
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  >
                    {suggestions.transport.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() =>
                          handleSuggestionClick("transport", suggestion)
                        }
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Farmer Selection */}
              <div className="group">
                <label
                  htmlFor="farmerId"
                  className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600"
                >
                  👨‍🌾 Select Farmer *
                </label>
                <select
                  id="farmerId"
                  name="farmerId"
                  value={formData.farmerId}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 bg-white"
                >
                  <option value="">Choose Farmer</option>
                  {farmers.map((farmer) => (
                    <option key={farmer._id} value={farmer._id}>
                      {farmer.name} ({farmer.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Variety */}
              <div className="group">
                <label
                  htmlFor="variety"
                  className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600"
                >
                  🥔 Variety *
                </label>
                <input
                  type="text"
                  id="variety"
                  name="variety"
                  placeholder="e.g., Kufri Jyoti"
                  value={formData.variety}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300"
                />
              </div>

              {/* Quality */}
              <div className="group">
                <label
                  htmlFor="quality"
                  className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600"
                >
                  ⭐ Quality Grade *
                </label>
                <select
                  id="quality"
                  name="quality"
                  value={formData.quality}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 bg-white"
                >
                  <option value="Premium">Premium</option>
                  <option value="A">Grade A</option>
                  <option value="B">Grade B</option>
                  <option value="C">Grade C</option>
                  <option value="Standard">Standard</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Bags */}
              <div className="group">
                <label
                  htmlFor="bags"
                  className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600"
                >
                  📦 Total Bags *
                </label>
                <input
                  type="number"
                  id="bags"
                  name="bags"
                  placeholder="Enter bags count"
                  value={formData.bags}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300"
                />
              </div>

              {/* Weight per Bag */}
              <div className="group">
                <label
                  htmlFor="weightPerBag"
                  className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600"
                >
                  ⚖️ Weight per Bag (KG) *
                </label>
                <input
                  type="number"
                  id="weightPerBag"
                  name="weightPerBag"
                  placeholder="e.g., 50.00"
                  value={formData.weightPerBag}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300"
                />
              </div>

              {/* Rate per Kg */}
              <div className="group">
                <label
                  htmlFor="ratePerKg"
                  className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600"
                >
                  💰 Rate per KG (₹) *
                </label>
                <input
                  type="number"
                  id="ratePerKg"
                  name="ratePerKg"
                  placeholder="e.g., 25.00"
                  value={formData.ratePerKg}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300"
                />
              </div>

              {/* Remarks */}
              <div className="md:col-span-2 lg:col-span-3 group">
                <label
                  htmlFor="remarks"
                  className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600"
                >
                  📝 Remarks (Optional)
                </label>
                <textarea
                  id="remarks"
                  name="remarks"
                  placeholder="Any additional notes..."
                  value={formData.remarks}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 resize-none"
                ></textarea>
              </div>
            </div>

            {/* Calculated Values Display */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-blue-800">
                  📊 Purchase Summary
                </h3>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">₹</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                  <p className="text-sm text-gray-600 mb-1">Total Weight</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {totalWeight} KG
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-green-700">₹{amount}</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl ${
                  submitting ? "animate-pulse" : ""
                }`}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Updating Purchase...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💾</span>
                    Update Purchase
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditPurchase;
