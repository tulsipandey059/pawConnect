const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    console.log(`Attempting to connect to MongoDB (5s timeout)...`);
    const conn = await Promise.race([
      mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 5000,
        retryWrites: true,
        w: 'majority',
        bufferCommands: true,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('MongoDB connection timeout')), 5500)
      )
    ]);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    return conn;
  } catch (error) {
    console.error(`⚠️  MongoDB Connection Error: ${error.message}`);
    console.log(`Continuing in offline/mock data mode...`);

    // Disable buffering to prevent "timed out after 10000ms" errors
    mongoose.set('bufferCommands', false);
    isConnected = false;
    return null;
  }
};

module.exports = connectDB;
module.exports.isConnected = () => isConnected;
