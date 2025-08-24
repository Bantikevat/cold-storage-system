const mongoose = require('mongoose');
require('dotenv').config();

async function checkFarmer() {
  try {
    console.log('Checking farmer with ID: 68a9973bbe9a7032d6dcdea8');
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected successfully');
    
    const Farmer = require('./models/Farmer');
    const farmer = await Farmer.findById('68a9973bbe9a7032d6dcdea8');
    
    if (farmer) {
      console.log('✅ Farmer found:', farmer.name, farmer.phone);
    } else {
      console.log('❌ Farmer not found with ID: 68a9973bbe9a7032d6dcdea8');
    }
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error checking farmer:', error.message);
    process.exit(1);
  }
}

checkFarmer();
