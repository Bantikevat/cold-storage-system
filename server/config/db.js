import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ColdStorage";

    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     const atlasURI = process.env.MONGO_URI;
//     const localURI =
//       process.env.MONGO_URI_LOCAL || "mongodb://127.0.0.1:27017/coldstorage";

//     // Agar Atlas URI set hai to usko use karo, warna Local
//     const MONGO_URI = atlasURI || localURI;

//     console.log(
//       `🔗 Attempting MongoDB connection → ${
//         MONGO_URI.includes("127.0.0.1") ? "Local" : "Atlas"
//       }`
//     );

//     const conn = await mongoose.connect(MONGO_URI, {
//       retryWrites: true,
//       w: "majority",
//       serverSelectionTimeoutMS: 5000,
//       socketTimeoutMS: 45000,
//     });

//     console.log("✅ MongoDB Connected:", conn.connection.host);
//     console.log("🟢 Database:", conn.connection.name);

//     mongoose.connection.on("error", (err) => {
//       console.error("❌ MongoDB Error:", err.message);
//     });

//     mongoose.connection.on("disconnected", () => {
//       console.warn("⚠️ MongoDB Disconnected");
//     });
//   } catch (err) {
//     console.error("❌ MongoDB connection failed:", err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     const connectionOptions = {
//       // SSL/TLS configuration to handle certificate issues
//       tls: true,
//       tlsAllowInvalidCertificates: true, // Allow invalid certificates
//       tlsAllowInvalidHostnames: true, // Allow invalid hostnames
//       // Connection retry settings
//       retryWrites: true,
//       w: 'majority',
//       // Server selection timeout
//       serverSelectionTimeoutMS: 5000,
//       // Socket timeout
//       socketTimeoutMS: 45000,
//     };

//     console.log("🔗 Attempting MongoDB connection with SSL options...");

//     const conn = await mongoose.connect(process.env.MONGO_URI, connectionOptions);

//     console.log(
//       "\x1b[32m%s\x1b[0m",
//       `✅ MongoDB Connected: ${conn.connection.host}`
//     );
//     console.log(
//       "\x1b[36m%s\x1b[0m",
//       `🟢 Database Name: ${conn.connection.name}`
//     );
//     console.log(
//       "\x1b[34m%s\x1b[0m",
//       `📡 Connection Ready State: ${conn.connection.readyState}`
//     ); // 1 = connected

//     // Handle connection events
//     mongoose.connection.on('error', (err) => {
//       console.error("\x1b[31m%s\x1b[0m", `❌ MongoDB connection error: ${err.message}`);
//     });

//     mongoose.connection.on('disconnected', () => {
//       console.log("\x1b[33m%s\x1b[0m", "⚠️  MongoDB disconnected");
//     });

//     mongoose.connection.on('reconnected', () => {
//       console.log("\x1b[32m%s\x1b[0m", "🔄 MongoDB reconnected");
//     });

//   } catch (error) {
//     console.error(
//       "\x1b[31m%s\x1b[0m",
//       `❌ Error connecting to MongoDB: ${error.message}`
//     );
//     console.error("\x1b[31m%s\x1b[0m", `Error details: ${error.stack}`);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
