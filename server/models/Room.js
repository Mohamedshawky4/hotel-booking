import mongoose from "mongoose";
const RoomSchema = new mongoose.Schema({
    hotel:{type : String,required : true , ref: "Hotel"},
    roomType:{type : String,required : true},
    pricePerNight:{type : Number,required : true},
    amenities:{type : Array,required : true},
    images:[{type : String,required : true}],
    isAvailable:{type : Boolean,default : true},
    maxGuests:{type : Number,required : true, default: 2},
    rating:{type : Number,default : 0},
    reviewCount:{type : Number,default : 0},
    description:{type : String,default : ""},
    size:{type : Number,default : 0}, // room size in square meters
    floor:{type : Number,default : 1},
    hasBalcony:{type : Boolean,default : false},
    hasOceanView:{type : Boolean,default : false},
    hasMountainView:{type : Boolean,default : false},
    cancellationPolicy:{type : String,enum:["free","flexible","moderate","strict"],default:"moderate"},
    checkInTime:{type : String,default : "15:00"},
    checkOutTime:{type : String,default : "11:00"},
    instantBooking:{type : Boolean,default : true},
    
},{timestamps : true});
const Room = mongoose.model("Room",RoomSchema);
export default Room;