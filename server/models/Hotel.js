import mongoose from "mongoose";
const HotelSchema = new mongoose.Schema({
    name:{type : String,required : true},
    address:{type : String,required : true},
    contact:{type : String,required : true},
    owner:{type : mongoose.Schema.Types.ObjectId,required : true , ref: "User"},
    city:{type : String,required : true},
    isApproved:{type : Boolean,default : false},
    rejectionReason:{type : String},
    approvedBy:{type : String,ref : "Admin"},
    approvedAt:{type : Date},
    
},{timestamps : true});
const Hotel = mongoose.model("Hotel",HotelSchema);
export default Hotel;