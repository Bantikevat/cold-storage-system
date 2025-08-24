const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Use local database connection
const connectLocalDB = require('./config/db.local');

async function checkAndAddStock() {
  try {
    console.log('🔗 Connecting to local MongoDB...');
    await connectLocalDB();
    
    const Stock = require('./models/Stock');
    
    // Check current stock
    const stocks = await Stock.find();
    console.log('\n📦 Current stock items:');
    stocks.forEach(stock => {
      console.log(`- ${stock.productName}: ${stock.currentStock} KG`);
    });
    
    // Check if "joyty" exists
    const joytyStock = await Stock.findOne({ productName: 'joyty' });
    if (!joytyStock) {
      console.log('\n❌ Product "joyty" not found in stock. Adding it...');
      
      // Add joyty to stock with initial quantity
      const newStock = new Stock({
        productName: 'joyty',
        currentStock: 1000, // Add initial stock
        minStockAlert: 10
      });
      
      await newStock.save();
      console.log('✅ Product "joyty" added to stock with 1000 KG');
    } else {
      console.log('\n✅ Product "joyty" already exists in stock');
      console.log(`Current stock: ${joytyStock.currentStock} KG`);
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Stock check completed successfully');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
}

checkAndAddStock();
