import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Mongoose is connected");
    });

   const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-booking';
   await mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 30000, // default is 30s
});


  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
