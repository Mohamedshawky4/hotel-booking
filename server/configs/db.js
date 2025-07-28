import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Mongoose is connected");
    });

   await mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000, // default is 30s
});


  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
