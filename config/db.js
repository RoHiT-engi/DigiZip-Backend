// import Mongoose from "mongoose";
const Mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const connectDB = async () => {
    const MONGO_URI = 'mongodb+srv://nvichare9:%23Rohit112@cluster0.yj1pgfd.mongodb.net/DigizipDB?retryWrites=true&w=majority'
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