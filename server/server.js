const dotenv = require("dotenv");
dotenv.config(); // ✅ Load environment variables at the very top

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");

// Import routes
const farmerRoutes = require("./routes/farmerRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const salesRoutes = require("./routes/salesRoutes");
const customerRoutes = require("./routes/customerRoutes");
const otpRoutes = require("./routes/otpRoutes");

// Initialize app
const app = express();

// ✅ Allow frontend (local + deployed) to access backend
const allowedOrigins = [
  "http://localhost:5173",
  "https://cold-storage-system-1ss.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// ✅ Connect to MongoDB
connectDB();

// ✅ Optional request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ✅ API Routes
app.use("/api/otp", otpRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/customers", customerRoutes);

// ✅ Error handling (last middleware)
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res
    .status(err.status || 500)
    .json({ error: err.message || "Something went wrong!" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
