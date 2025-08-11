import Booking from "../models/Bookings.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import availabilityCache from "../utils/cache.js";

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

//check availability API
export const checkAvailabilityApi = async (req, res) => {
    try{
        const {room,checkInDate,checkOutDate}=req.body;
        const isAvailable=await checkAvailability({checkInDate,checkOutDate,room});
        res.json({success:true,isAvailable});
    }catch(error){
        res.json({success:false,message:error.message});
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
        
        // Clear availability cache for this room
        availabilityCache.clearRoom(room);
        
        res.json({ success: true, message: "Booking created successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//get user bookings
export const getUserBookings = async (req, res) => {
    try{
        const user=req.user._id;
        const bookings=await Booking.find({user}).populate([
            {path:"room",populate:{path:"hotel"}},
            {path:"hotel"},
            {path:"user"}
        ]).sort({createdAt:-1});
        res.json({success:true,bookings});
    }catch(error){
        res.json({success:false,message:error.message});
    }
}

//get hotel bookings
export const getHotelBookings = async (req, res) => {
    try{
        const owner=req.user._id;
        const hotel=await Hotel.findOne({owner});
        if(!hotel){
            return res.json({success:false,message:"Hotel not found"});
        }
        const bookings=await Booking.find({hotel:hotel._id}).populate([
            {path:"room"},
            {path:"user"}
        ]).sort({createdAt:-1});
        
        // Calculate dashboard statistics
        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
        const pendingBookings = bookings.filter(booking => booking.status === 'pending').length;
        const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed').length;
        const cancelledBookings = bookings.filter(booking => booking.status === 'cancelled').length;
        
        // Get top performing rooms
        const roomStats = {};
        bookings.forEach(booking => {
            const roomType = booking.room.roomType;
            if (!roomStats[roomType]) {
                roomStats[roomType] = { bookings: 0, revenue: 0 };
            }
            roomStats[roomType].bookings++;
            roomStats[roomType].revenue += booking.totalPrice;
        });
        
        const topRooms = Object.entries(roomStats)
            .map(([roomType, stats]) => ({
                roomType,
                bookings: stats.bookings,
                revenue: stats.revenue,
                occupancyRate: Math.round((stats.bookings / totalBookings) * 100)
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
        
        // Mock recent activity
        const recentActivity = [
            {
                message: "New booking received for Deluxe Room",
                timestamp: new Date()
            },
            {
                message: "Booking confirmed for Suite",
                timestamp: new Date(Date.now() - 3600000)
            },
            {
                message: "Payment received for Standard Room",
                timestamp: new Date(Date.now() - 7200000)
            }
        ];
        
        const dashboardData = {
            bookings: bookings.slice(0, 10), // Recent 10 bookings
            totalBookings,
            totalRevenue,
            pendingBookings,
            confirmedBookings,
            cancelledBookings,
            topRooms,
            recentActivity
        };
        
        res.json({success:true,dashboardData});
    }catch(error){
        res.json({success:false,message:error.message});
    }
}

//modify booking
export const modifyBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { checkInDate, checkOutDate, guests } = req.body;
        const userId = req.user._id;
        
        // Find the booking and verify ownership
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }
        
        if (booking.user.toString() !== userId) {
            return res.json({ success: false, message: "Unauthorized to modify this booking" });
        }
        
        // Check if booking can be modified (more than 24 hours before check-in)
        const checkIn = new Date(booking.checkInDate);
        const now = new Date();
        const hoursUntilCheckIn = (checkIn - now) / (1000 * 60 * 60);
        
        if (hoursUntilCheckIn < 24) {
            return res.json({ 
                success: false, 
                message: "Bookings can only be modified at least 24 hours before check-in" 
            });
        }
        
        // Check availability for new dates
        const isAvailable = await checkAvailability({
            checkInDate,
            checkOutDate,
            room: booking.room
        });
        
        if (!isAvailable) {
            return res.json({ success: false, message: "Room not available for selected dates" });
        }
        
        // Calculate new total price
        const roomData = await Room.findById(booking.room);
        const checkInNew = new Date(checkInDate);
        const checkOutNew = new Date(checkOutDate);
        const timeDiff = checkOutNew.getTime() - checkInNew.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const newTotalPrice = nights * roomData.pricePerNight;
        
        // Update booking
        booking.checkInDate = checkInDate;
        booking.checkOutDate = checkOutDate;
        booking.guests = guests;
        booking.totalPrice = newTotalPrice;
        booking.updatedAt = new Date();
        
        await booking.save();
        
        // Clear availability cache for this room
        availabilityCache.clearRoom(booking.room);
        
        res.json({ 
            success: true, 
            message: "Booking modified successfully",
            booking: {
                id: booking._id,
                totalPrice: newTotalPrice,
                nights: nights
            }
        });
        
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//cancel booking
export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user._id;
        
        // Find the booking and verify ownership
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }
        
        if (booking.user.toString() !== userId) {
            return res.json({ success: false, message: "Unauthorized to cancel this booking" });
        }
        
        // Check if booking can be cancelled
        const checkIn = new Date(booking.checkInDate);
        const now = new Date();
        const hoursUntilCheckIn = (checkIn - now) / (1000 * 60 * 60);
        
        if (hoursUntilCheckIn < 0) {
            return res.json({ 
                success: false, 
                message: "Cannot cancel a booking that has already started" 
            });
        }
        
        // Calculate cancellation fee based on hotel policy
        let cancellationFee = 0;
        const roomData = await Room.findById(booking.room).populate('hotel');
        
        if (hoursUntilCheckIn < 24) {
            // Less than 24 hours: 100% fee
            cancellationFee = booking.totalPrice;
        } else if (hoursUntilCheckIn < 72) {
            // Less than 72 hours: 50% fee
            cancellationFee = booking.totalPrice * 0.5;
        } else {
            // More than 72 hours: no fee
            cancellationFee = 0;
        }
        
        // Update booking status
        booking.status = 'cancelled';
        booking.cancellationFee = cancellationFee;
        booking.cancelledAt = new Date();
        booking.updatedAt = new Date();
        
        await booking.save();
        
        // Clear availability cache for this room
        availabilityCache.clearRoom(booking.room);
        
        res.json({ 
            success: true, 
            message: "Booking cancelled successfully",
            cancellationFee: cancellationFee,
            refundAmount: booking.totalPrice - cancellationFee
        });
        
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//get booking details
export const getBookingDetails = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user._id;
        
        const booking = await Booking.findById(bookingId).populate([
            { path: "room", populate: { path: "hotel" } },
            { path: "hotel" },
            { path: "user" }
        ]);
        
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }
        
        // Check if user is authorized to view this booking
        if (booking.user._id.toString() !== userId) {
            return res.json({ success: false, message: "Unauthorized to view this booking" });
        }
        
        res.json({ success: true, booking });
        
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}