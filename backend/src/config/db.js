const mongoose = require('mongoose');
const { MONGO_URI } = require('./env'); // Assuming env.js exports MONGO_URI

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      // useNewUrlParser: true, // Deprecated in Mongoose 6.0
      // useUnifiedTopology: true, // Deprecated in Mongoose 6.0
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
