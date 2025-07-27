import mongoose from "mongoose";
const connectDB = async () => {
    try {
        console.log(process.env.MONGODB_URI);
        mongoose.connection.on("connected", () => {
            console.log("Mongoose is connected");
        })
        // console.log(process.env.MONGODB_URI);
         await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`);
         
       
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};
export default connectDB
