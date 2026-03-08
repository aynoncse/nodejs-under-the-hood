/**
 * config/db.js
 *
 * MongoDB connection helper using mongoose. Exits the process if the
 * required connection string is missing.  In a real production system the
 * URI should be obtained from a secure vault or environment variable and
 * the cluster should be configured with authentication, TLS, and proper
 * networking rules.
 *
 * ENV VARIABLES:
 *   - MONGO_URI : full connection string (required)
 *   - DB_NAME   : optional database name to use
 */

const mongoose = require('mongoose');
// Connect to MongoDB Atlas
const dbURI = process.env.MONGO_URI;
if (!dbURI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log('Successfully connected to MongoDB Atlas!');
  } catch (error) {
    console.error('Error connecting to Atlas:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
