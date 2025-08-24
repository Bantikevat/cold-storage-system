const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGO_URI:', process.env.MONGO_URI ? 'Present' : 'Missing');
    
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

    console.log('🔗 Using SSL/TLS connection options...');
    
    const conn = await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    
    console.log('✅ MongoDB Connected successfully');
    console.log('Host:', conn.connection.host);
    console.log('Database:', conn.connection.name);
    console.log('Ready State:', conn.connection.readyState);
    
    // Test if Purchase model can be used
    const Purchase = require('./models/Purchase');
    const count = await Purchase.countDocuments();
    console.log('Total purchases in database:', count);
    
    // Test if Farmer model can be used
    const Farmer = require('./models/Farmer');
    const farmerCount = await Farmer.countDocuments();
    console.log('Total farmers in database:', farmerCount);
    
    // Test if Stock model can be used
    const Stock = require('./models/Stock');
    const stockCount = await Stock.countDocuments();
    console.log('Total stock items in database:', stockCount);
    
    mongoose.connection.close();
    console.log('✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
}

testConnection();
