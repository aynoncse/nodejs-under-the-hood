const mongoose = require('mongoose');
// Connect to MongoDB Atlas
const dbURI = process.env.MONGO_URI;
if (!dbURI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose
           .connect(process.env.MONGO_URI, {
             dbName: 'mini-json-database',
           })
           console.log('Successfully connected to MongoDB Atlas!');
    } catch (error) {
        console.error('Error connecting to Atlas:', err);
        process.exit(1);
    }
}

module.exports = connectDB