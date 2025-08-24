const mongoose = require("mongoose");

// Local MongoDB connection for development
const connectLocalDB = async () => {
  try {
    const localMongoURI = "mongodb://localhost:27017/cold_storage_system";
    
    console.log("🔗 Attempting local MongoDB connection...");
    
    const conn = await mongoose.connect(localMongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(
      "\x1b[32m%s\x1b[0m",
      `✅ Local MongoDB Connected: ${conn.connection.host}`
    );
    console.log(
      "\x1b[36m%s\x1b[0m",
      `🟢 Database Name: ${conn.connection.name}`
    );

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error("\x1b[31m%s\x1b[0m", `❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log("\x1b[33m%s\x1b[0m", "⚠️  MongoDB disconnected");
    });

    mongoose.connection.on('reconnected', () => {
      console.log("\x1b[32m%s\x1b[0m", "🔄 MongoDB reconnected");
    });

  } catch (error) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      `❌ Error connecting to local MongoDB: ${error.message}`
    );
    console.log("\x1b[33m%s\x1b[0m", "💡 Please make sure MongoDB is running locally on port 27017");
    console.log("\x1b[33m%s\x1b[0m", "💡 You can download MongoDB Community Server from: https://www.mongodb.com/try/download/community");
    process.exit(1);
  }
};

module.exports = connectLocalDB;
