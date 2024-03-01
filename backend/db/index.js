const mongoose = require('mongoose');
require('dotenv').config();

const { DB_CONNECTION_STRING } = process.env;

if (!DB_CONNECTION_STRING) {
  console.error('MongoDB URI is missing. Please check your .env file.');
  process.exit(1);
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_CONNECTION_STRING, {
    });
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
};

module.exports = connectToDatabase;
