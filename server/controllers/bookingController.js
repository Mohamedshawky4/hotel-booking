import Booking from "../models/Bookings.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

//check if rooom available for booking
export const checkAvailability = async ({checkInDate,checkOutDate,room}) => {
    try{
        const bookings=await Booking.find({
            room,
            checkInDate:{$lte:checkOutDate},
            checkOutDate:{$gte:checkInDate}
        });
        const isAvailable=bookings.length===0;
        return isAvailable;
    }catch(error){
        res.json(error.message);
    }
}
//api to check availability of room
export const checkAvailabilityApi = async (req, res) => {
    try {
        const{room,checkInDate,checkOutDate}=req.body;
        const isAvailable=await checkAvailability({checkInDate,checkOutDate,room});
        res.json({ success: true, isAvailable });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
//create new booking
export const createBooking = async (req, res) => {
    try {
        //check availability
        const{room,checkInDate,checkOutDate,guests}=req.body;
        const user=req.user._id;
        const isAvailable=await checkAvailability({checkInDate,checkOutDate,room});
        if(!isAvailable){
            return res.json({ success: false, message: "Room not available" });
        }
        const roomData=await Room.findById(room).populate("hotel");
        let totalPrice=roomData.pricePerNight;
        const checkIn=new Date(checkInDate);
        const checkOut=new Date(checkOutDate);
        const timeDiff=checkOut.getTime()-checkIn.getTime();
        const nights=Math.ceil(timeDiff/(1000*60*60*24));
        totalPrice=nights*totalPrice;
        await Booking.create({
            user,
            room,
            hotel:roomData.hotel._id,
            guests:+guests,
            checkInDate,
            checkOutDate,
            totalPrice
        });
        res.json({ success: true, message: "Booking created successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


//get all bookings for a user
export const getUserBookings = async (req, res) => {
    try {
        const user=req.user._id;
        const bookings=await Booking.find({user}).populate("room hotel").sort({createdAt:-1});
        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
export const getHotelBookings = async (req, res) => {
    try {
        const hotel=await Hotel.findOne({owner:req.auth.userId});
       if(!hotel){
        return res.json({ success: false, message: "Hotel not found" });
       }
        const bookings=await Booking.find({hotel:hotel._id}).populate("room hotel user").sort({createdAt:-1});
        const totalBookings=bookings.length;
        const totalRevune=bookings.reduce((acc,booking)=>acc+booking.totalPrice,0);
        res.json({ success: true, dashboardData:{totalBookings,totalRevune,bookings} });
    } catch (error) {
        res.json({ success: false, message: "failed to get bookings" });
    }
}