const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log('\x1b[32m%s\x1b[0m', `✅ MongoDB Connected: ${conn.connection.host}`);
    console.log('\x1b[36m%s\x1b[0m', `🟢 Database Name: ${conn.connection.name}`);
    console.log('\x1b[34m%s\x1b[0m', `📡 Connection Ready State: ${conn.connection.readyState}`); // 1 = connected
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `❌ Error connecting DB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
