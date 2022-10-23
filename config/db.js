import Mongoose from "mongoose";
const connectDB = async () => {
    const MONGO_URI = 'mongodb+srv://Rohit123:Rohit123@fetchbookback.hidvq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    try {
      const conn = Mongoose.connect(MONGO_URI, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          // useCreateIndex: true,
      })
      console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
      console.error(`Error: ${error.message}`)
      process.exit(1)
    }
  }
  
  export default connectDB;