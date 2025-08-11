import express from 'express';
import { 
    checkAvailabilityApi, 
    createBooking, 
    getHotelBookings, 
    getUserBookings, 
    modifyBooking, 
    cancelBooking, 
    getBookingDetails 
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const bookingRouter = express.Router();

// Public routes
bookingRouter.post("/check-availability", checkAvailabilityApi);

// Protected routes (require authentication)
bookingRouter.post("/book", protect, createBooking);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/hotel", protect, getHotelBookings);
bookingRouter.get("/:bookingId", protect, getBookingDetails);
bookingRouter.put("/:bookingId/modify", protect, modifyBooking);
bookingRouter.put("/:bookingId/cancel", protect, cancelBooking);

export default bookingRouter;