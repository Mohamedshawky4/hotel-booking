import express from 'express';
import { getRooms, getRoomsByOwner, addRoom, toggleRoomAvailability, getRoomAvailability, updateRoom, deleteRoom, addSampleRatings } from '../controllers/roomController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import availabilityCache from '../utils/cache.js';

const roomRouter = express.Router();

// Public routes
roomRouter.get("/", getRooms);
roomRouter.get("/availability/:roomId", getRoomAvailability);

// Cache management (for debugging)
roomRouter.get("/cache/stats", (req, res) => {
    res.json({
        success: true,
        stats: availabilityCache.getStats()
    });
});

roomRouter.delete("/cache/clear", (req, res) => {
    availabilityCache.clear();
    res.json({
        success: true,
        message: "Cache cleared successfully"
    });
});

// Protected routes (require authentication)
roomRouter.get("/owner", protect, getRoomsByOwner);
roomRouter.post("/add", protect, upload.array('images', 5), addRoom);
roomRouter.post("/toggle-availability", protect, toggleRoomAvailability);
roomRouter.put("/:roomId", protect, upload.array('images', 5), updateRoom);
roomRouter.delete("/:roomId", protect, deleteRoom);

// Development route (for adding sample ratings)
roomRouter.post("/add-sample-ratings", addSampleRatings);

export default roomRouter;