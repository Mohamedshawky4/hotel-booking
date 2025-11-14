import express from 'express';
import {
    adminLogin,
    getDashboardStats,
    getAllUsers,
    updateUser,
    deleteUser,
    getAllHotels,
    updateHotelStatus,
    deleteHotel,
    getSystemAnalytics
} from '../controllers/adminController.js';
import { adminAuth, requirePermission, requireAnyPermission } from '../middleware/adminAuthMiddleware.js';

const adminRouter = express.Router();

// Public routes (no authentication required)
adminRouter.post('/login', adminLogin);

// Protected routes (require admin authentication)
adminRouter.use(adminAuth);

// Dashboard
adminRouter.get('/dashboard', requirePermission('analytics'), getDashboardStats);

// User Management
adminRouter.get('/users', requirePermission('userManagement'), getAllUsers);
adminRouter.put('/users/:userId', requirePermission('userManagement'), updateUser);
adminRouter.delete('/users/:userId', requirePermission('userManagement'), deleteUser);

// Hotel Management
adminRouter.get('/hotels', requirePermission('hotelManagement'), getAllHotels);
adminRouter.put('/hotels/:hotelId/status', requirePermission('hotelManagement'), updateHotelStatus);
adminRouter.delete('/hotels/:hotelId', requirePermission('hotelManagement'), deleteHotel);

// Analytics
adminRouter.get('/analytics', requirePermission('analytics'), getSystemAnalytics);

export default adminRouter;
