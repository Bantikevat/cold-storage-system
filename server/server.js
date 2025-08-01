const dotenv = require('dotenv');
dotenv.config(); // ✅ Sabse upar hona chahiye

const express = require('express');
const cookieParser = require('cookie-parser'); // <-- Missing import added
const cors = require('cors');
const connectDB = require('./config/db');

const farmerRoutes = require('./routes/farmerRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const salesRoutes = require('./routes/salesRoutes');
const customerRoutes = require('./routes/customerRoutes');
const storageRoutes = require('./routes/storageRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const otpRoutes = require('./routes/otpRoutes');
const stockRoutes = require('./routes/stockRoutes');

const app = express(); // <-- Moved up before middleware

const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'https://cold-storage-system-1.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


app.use(express.json());

connectDB();

app.use(cookieParser());
app.use(express.json());

// Optional: Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/otp', otpRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
