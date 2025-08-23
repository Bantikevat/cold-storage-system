const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      unique: true,
      // Simple validation for a 10-digit phone number
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      // A simple regex for email validation
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please fill a valid email address",
      ],
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    gstin: {
      type: String,
      trim: true,
      default: "",
    },
    creditLimit: {
      type: Number,
      default: 0,
    },
    remarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt timestamps

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
