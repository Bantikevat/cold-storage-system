const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, ".env") }); // ✅ Load environment variables at the very top

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Use local database for development to avoid MongoDB Atlas IP whitelisting issues
console.log("⚠️  Using local database connection for development");
const connectDB = require("./config/db.local");

const stockRoutes = require("./routes/stockRoutes"); // Import stock routes
const farmerRoutes = require("./routes/farmerRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const salesRoutes = require("./routes/salesRoutes");
const customerRoutes = require("./routes/customerRoutes");
const otpRoutes = require("./routes/otpRoutes");

// Initialize app
const app = express();

// ✅ Allow frontend (local + deployed) to access backend
// ✅ Allowed frontend origins (local + deployed)
const allowedOrigins = [
  "http://localhost:5173",
  "https://cold-storage-system-1ss.onrender.com", // ✅ Your frontend hosted on Render
];

// ✅ CORS Middleware with Preflight Handling
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman/curl
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
app.use("/api/stock", stockRoutes); // Add stock routes

// ✅ Error handling (last middleware)
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);

  // Improve Mongoose validation error handling
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages,
    });
  }

  if (res.headersSent) {
    return next(err);
  }

  res
    .status(err.status || 500)
    .json({ error: err.message || "Something went wrong!" });
});

// ✅ Check for JWT secret
if (!process.env.JWT_SECRET) {
  console.warn(
    "⚠️  JWT_SECRET environment variable not set. Using fallback secret for development."
  );
  process.env.JWT_SECRET = "fallback_secret_key_for_development_only";
}

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


