const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB with URI:', process.env.MONGODB_URI);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('MongoDB Connection State:', mongoose.connection.readyState);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

module.exports = connectDB;