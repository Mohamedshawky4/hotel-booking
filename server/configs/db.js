import mongoose from "mongoose";
const connectDB = async () => {
    try {
        console.log(process.env.MONGODB_URI);
        mongoose.connection.on("connected", () => {
            console.log("Mongoose is connected");
        })
         await mongoose.connect(`${process.env.MONGODB_URI}`);
       
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};
export default connectDB
