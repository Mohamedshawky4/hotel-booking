
import Hotel from "../models/Hotel.js";
import{v2 as cloudinary} from "cloudinary";
import Room from "../models/Room.js";
import Booking from "../models/Bookings.js";
import availabilityCache from "../utils/cache.js";


export const createRoom =async (req, res) => {
    try{
        const {roomType,pricePerNight,amenities}=req.body
        const hotel=await Hotel.findOne({owner:req.auth.userId});
        if(!hotel){
            return res.json({success:false,message:"Hotel not found"});
        }
        // UPLOAD IMAGES
        const uploadImages=req.files.map(async(file)=>{
            const response=await cloudinary.uploader.upload(file.path);
            return response.secure_url;

        });
        const images=await Promise.all(uploadImages);
        await Room.create({
            hotel:hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities : JSON.parse(amenities),
            images});
            res.json({success:true,message:"Room created successfully"});
    }catch(error){
        res.json({success:false,message:error.message});
    }
    
};

//get all rooms
export const getRooms = async(req, res) => {
    try{
        const rooms=await Room.find({isAvailable:true}).populate({
            path:"hotel",
            populate:{
                path:"owner",
                select:"image"
            }
        }).sort({createdAt:-1});
        
        // Debug: Log rooms data
        console.log('getRooms - Found rooms:', rooms.length);
        if (rooms.length > 0) {
            console.log('Sample room data:', {
                id: rooms[0]._id,
                roomType: rooms[0].roomType,
                rating: rooms[0].rating,
                reviewCount: rooms[0].reviewCount,
                hotel: rooms[0].hotel
            });
        }
        
        res.json({success:true,rooms});
        
        
    }catch(error){
        console.error('getRooms error:', error);
        res.json({success:false,message:error.message});
    }
};

//get rooms by owner
export const getRoomsByOwner = async(req, res) => {
    try{
        const owner=req.user._id;
        const rooms=await Room.find({hotel:owner}).populate("hotel");
        res.json({success:true,rooms});
    }catch(error){
        res.json({success:false,message:error.message});
    }
};

//add new room
export const addRoom = async(req, res) => {
    try{
        const {roomType,pricePerNight,amenities,images,maxGuests,description,size,floor,hasBalcony,hasOceanView,hasMountainView,cancellationPolicy,checkInTime,checkOutTime,instantBooking}=req.body;
        const owner=req.user._id;
        const hotel=await Hotel.findOne({owner:owner});
        if(!hotel){
            return res.json({success:false,message:"Hotel not found"});
        }
        await Room.create({
            hotel:hotel._id,
            roomType,
            pricePerNight,
            amenities,
            images,
            maxGuests: maxGuests || 2,
            description: description || "",
            size: size || 0,
            floor: floor || 1,
            hasBalcony: hasBalcony || false,
            hasOceanView: hasOceanView || false,
            hasMountainView: hasMountainView || false,
            cancellationPolicy: cancellationPolicy || "moderate",
            checkInTime: checkInTime || "15:00",
            checkOutTime: checkOutTime || "11:00",
            instantBooking: instantBooking !== undefined ? instantBooking : true
        });
        res.json({success:true,message:"Room added successfully"});
    }catch(error){
        res.json({success:false,message:error.message});
    }
};

//toggle room availability
export const toggleRoomAvailability = async(req, res) => {
    try{
        const {roomId}=req.body;
        const room=await Room.findById(roomId);
        if(!room){
            return res.json({success:false,message:"Room not found"});
        }
        room.isAvailable=!room.isAvailable;
        await room.save();
        res.json({success:true,message:room.isAvailable?"Room is now available":"Room is now unavailable"});
    }catch(error){
        res.json({success:false,message:error.message});
    }
};

//get room availability for calendar
export const getRoomAvailability = async(req, res) => {
    try{
        const {roomId} = req.params;
        const {month, year} = req.query;
        
        // Validate parameters
        if (!roomId || !month || !year) {
            return res.json({success: false, message: "Missing required parameters: roomId, month, year"});
        }
        
        // Check cache first
        const cachedData = availabilityCache.get(roomId, month, year);
        if (cachedData) {
            return res.json({
                success: true,
                ...cachedData,
                cached: true
            });
        }
        
        // Validate room exists
        const room = await Room.findById(roomId);
        if(!room){
            return res.json({success: false, message: "Room not found"});
        }
        
        // Check if room is available for booking
        if (!room.isAvailable) {
            return res.json({
                success: true,
                bookedDates: [], // All dates are effectively "booked" if room is unavailable
                roomInfo: {
                    id: room._id,
                    name: room.roomType,
                    isAvailable: room.isAvailable
                },
                message: "Room is currently unavailable for booking"
            });
        }
        
        // Get start and end of month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        
        // Get all bookings for this room in the specified month
        const bookings = await Booking.find({
            room: roomId,
            $or: [
                {
                    checkInDate: { $lte: endDate },
                    checkOutDate: { $gte: startDate }
                }
            ]
        }).select('checkInDate checkOutDate status');
        
        // Generate array of booked dates
        const bookedDates = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        
        bookings.forEach(booking => {
            if (booking.status !== 'cancelled') {
                const start = new Date(booking.checkInDate);
                const end = new Date(booking.checkOutDate);
                
                // Only include dates from today onwards
                const effectiveStart = start < today ? today : start;
                
                for (let d = new Date(effectiveStart); d < end; d.setDate(d.getDate() + 1)) {
                    bookedDates.push(d.toISOString().split('T')[0]);
                }
            }
        });
        
        // Add past dates as booked (can't book in the past)
        const pastDates = [];
        const monthStart = new Date(year, month - 1, 1);
        const monthEnd = new Date(year, month, 0);
        
        for (let d = new Date(monthStart); d <= monthEnd && d < today; d.setDate(d.getDate() + 1)) {
            pastDates.push(d.toISOString().split('T')[0]);
        }
        
        // Combine past dates and booked dates
        const allUnavailableDates = [...new Set([...bookedDates, ...pastDates])];
        
        const responseData = {
            bookedDates: allUnavailableDates,
            roomInfo: {
                id: room._id,
                name: room.roomType,
                isAvailable: room.isAvailable,
                pricePerNight: room.pricePerNight,
                maxGuests: room.maxGuests
            },
            monthInfo: {
                month: parseInt(month),
                year: parseInt(year),
                totalDays: monthEnd.getDate()
            }
        };
        
        // Cache the result
        availabilityCache.set(roomId, month, year, responseData);
        
        res.json({
            success: true,
            ...responseData
        });
        
    } catch(error) {
        console.error('Error in getRoomAvailability:', error);
        res.json({success: false, message: error.message});
    }
};

//update room details
export const updateRoom = async(req, res) => {
    try{
        const {roomId} = req.params;
        const updateData = req.body;
        
        const room = await Room.findById(roomId);
        if(!room){
            return res.json({success: false, message: "Room not found"});
        }
        
        // Update room with new data
        Object.assign(room, updateData);
        await room.save();
        
        res.json({success: true, message: "Room updated successfully"});
        
    } catch(error) {
        res.json({success: false, message: error.message});
    }
};

//delete room
export const deleteRoom = async(req, res) => {
    try{
        const {roomId} = req.params;
        
        // Check if room has any active bookings
        const activeBookings = await Booking.find({
            room: roomId,
            status: { $in: ['pending', 'confirmed'] },
            checkOutDate: { $gte: new Date() }
        });
        
        if(activeBookings.length > 0){
            return res.json({
                success: false, 
                message: "Cannot delete room with active bookings"
            });
        }
        
        await Room.findByIdAndDelete(roomId);
        res.json({success: true, message: "Room deleted successfully"});
        
    } catch(error) {
        res.json({success: false, message: error.message});
    }
};

// Add sample ratings to rooms (for development/testing)
export const addSampleRatings = async(req, res) => {
    try {
        const rooms = await Room.find({});
        
        for (const room of rooms) {
            // Generate random rating between 3.5 and 5.0
            const randomRating = Math.floor(Math.random() * 15) / 10 + 3.5;
            // Generate random review count between 10 and 200
            const randomReviewCount = Math.floor(Math.random() * 190) + 10;
            
            room.rating = Math.round(randomRating * 10) / 10; // Round to 1 decimal place
            room.reviewCount = randomReviewCount;
            await room.save();
        }
        
        res.json({
            success: true, 
            message: `Updated ratings for ${rooms.length} rooms`
        });
        
    } catch(error) {
        res.json({success: false, message: error.message});
    }
};