// import Mongoose from "mongoose";
const Mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI;
    try {
      const conn = await Mongoose.connect(MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        serverApi: ServerApiVersion.v1,
      })
  
      console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
      console.error(`Error: ${error.message}`)
      process.exit(1)
    }
  }
  
  module.exports = connectDB