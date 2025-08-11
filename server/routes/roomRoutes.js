import express from 'express';
import { getRooms, getRoomsByOwner, addRoom, toggleRoomAvailability, getRoomAvailability, updateRoom, deleteRoom } from '../controllers/roomController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const roomRouter = express.Router();

// Public routes
roomRouter.get("/", getRooms);
roomRouter.get("/availability/:roomId", getRoomAvailability);

// Protected routes (require authentication)
roomRouter.get("/owner", protect, getRoomsByOwner);
roomRouter.post("/add", protect, upload.array('images', 5), addRoom);
roomRouter.post("/toggle-availability", protect, toggleRoomAvailability);
roomRouter.put("/:roomId", protect, upload.array('images', 5), updateRoom);
roomRouter.delete("/:roomId", protect, deleteRoom);

export default roomRouter;