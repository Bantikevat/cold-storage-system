const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

// Simple test to check database connection and purchases
async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected:', conn.connection.host);
    
    // Check if Purchase model exists
    const Purchase = require('./server/models/Purchase');
    
    // Count total purchases
    const purchaseCount = await Purchase.countDocuments();
    console.log('📊 Total purchases in database:', purchaseCount);
    
    // Get some sample purchases
    const samplePurchases = await Purchase.find().limit(5);
    console.log('📝 Sample purchases:', samplePurchases);
    
    // Test the distinct query for suggestions
    const coldStorageSuggestions = await Purchase.distinct('coldStorage');
    console.log('🏬 Cold Storage suggestions:', coldStorageSuggestions);
    
    const vehicleNoSuggestions = await Purchase.distinct('vehicleNo');
    console.log('🚛 Vehicle No suggestions:', vehicleNoSuggestions);
    
    mongoose.connection.close();
    console.log('✅ Test completed successfully');
    
  } catch (error) {
    console.error('❌ Error testing database:', error.message);
    process.exit(1);
  }
}

testDatabase();
