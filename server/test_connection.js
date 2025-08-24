
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

console.log("Testing MongoDB connection...");
console.log("MONGO_URI:", process.env.MONGO_URI ? "Present" : "Missing");
if (process.env.MONGO_URI) {
  console.log("URI Length:", process.env.MONGO_URI.length);
}

const testConnection = async () => {
  try {
    const connectionOptions = {
      // SSL/TLS configuration to handle certificate issues
      tls: true,
      tlsAllowInvalidCertificates: true, // Allow invalid certificates
      tlsAllowInvalidHostnames: true, // Allow invalid hostnames
      // Connection retry settings
      retryWrites: true,
      w: 'majority',
      // Server selection timeout
      serverSelectionTimeoutMS: 5000,
      // Socket timeout
      socketTimeoutMS: 45000,
    };

    console.log("🔗 Using SSL/TLS connection options...");
    
    const conn = await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    console.log("✅ MongoDB Connected Successfully!");
    console.log("Host:", conn.connection.host);
    console.log("Database:", conn.connection.name);
    console.log("Ready State:", conn.connection.readyState);
    
    // Test if we can create a simple document
    const TestModel = mongoose.model('Test', new mongoose.Schema({ name: String }));
    const testDoc = new TestModel({ name: 'test connection' });
    await testDoc.save();
    console.log("✅ Document saved successfully!");
    
    await mongoose.connection.close();
    console.log("Connection closed.");
  } catch (error) {
    console.error("❌ Connection Error:", error.message);
    console.error("Error Details:", error);
    console.error("Error Stack:", error.stack);
  }
};

testConnection();
