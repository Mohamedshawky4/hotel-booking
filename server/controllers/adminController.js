import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Booking from "../models/Bookings.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Admin Authentication
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await Admin.findOne({ email, isActive: true });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                adminId: admin._id, 
                role: admin.role,
                permissions: admin.permissions 
            },
            process.env.JWT_SECRET || 'admin-secret-key',
            { expiresIn: '24h' }
        );

        // Remove password from response
        const adminData = {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions,
            profile: admin.profile,
            lastLogin: admin.lastLogin
        };

        res.json({
            success: true,
            message: "Login successful",
            token,
            admin: adminData
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get Admin Dashboard Statistics
export const getDashboardStats = async (req, res) => {
    try {
        // Get total counts
        const totalUsers = await User.countDocuments();
        const totalHotels = await Hotel.countDocuments();
        const totalRooms = await Room.countDocuments();
        const totalBookings = await Booking.countDocuments();

        // Get pending hotel approvals
        const pendingHotels = await Hotel.countDocuments({ isApproved: false });

        // Get recent bookings
        const recentBookings = await Booking.find()
            .populate('user', 'username email')
            .populate('room', 'roomType')
            .populate('hotel', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get revenue statistics
        const totalRevenue = await Booking.aggregate([
            { $match: { status: { $in: ['confirmed', 'completed'] } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);

        // Get monthly bookings for chart
        const monthlyBookings = await Booking.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
            { $limit: 12 }
        ]);

        // Get top performing hotels
        const topHotels = await Booking.aggregate([
            { $match: { status: { $in: ['confirmed', 'completed'] } } },
            {
                $group: {
                    _id: "$hotel",
                    totalBookings: { $sum: 1 },
                    totalRevenue: { $sum: "$totalPrice" }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 5 }
        ]);

        // Populate hotel names for top hotels
        const topHotelsWithNames = await Hotel.populate(topHotels, {
            path: '_id',
            select: 'name city'
        });

        const dashboardData = {
            overview: {
                totalUsers,
                totalHotels,
                totalRooms,
                totalBookings,
                pendingHotels,
                totalRevenue: totalRevenue[0]?.total || 0
            },
            recentBookings,
            monthlyBookings,
            topHotels: topHotelsWithNames
        };

        res.json({
            success: true,
            data: dashboardData
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching dashboard statistics"
        });
    }
};

// Get All Users (with pagination and filters)
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', role = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        // Build query
        let query = {};
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (role) {
            query.role = role;
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with pagination
        const users = await User.find(query)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-password');

        // Get total count
        const totalUsers = await User.countDocuments(query);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalUsers / limit),
                    totalUsers,
                    hasNext: page * limit < totalUsers,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching users"
        });
    }
};

// Update User
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        // Remove sensitive fields that shouldn't be updated
        delete updateData.password;
        delete updateData._id;

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "User updated successfully",
            user
        });

    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: "Error updating user"
        });
    }
};

// Delete User
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if user has active bookings
        const activeBookings = await Booking.find({
            user: userId,
            status: { $in: ['pending', 'confirmed'] },
            checkOutDate: { $gte: new Date() }
        });

        if (activeBookings.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete user with active bookings"
            });
        }

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: "Error deleting user"
        });
    }
};

// Get All Hotels (with pagination and filters)
export const getAllHotels = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        // Build query
        let query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } }
            ];
        }
        if (status === 'pending') {
            query.isApproved = false;
        } else if (status === 'approved') {
            query.isApproved = true;
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with pagination
        const hotels = await Hotel.find(query)
            .populate('owner', 'username email')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        // Get total count
        const totalHotels = await Hotel.countDocuments(query);

        res.json({
            success: true,
            data: {
                hotels,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalHotels / limit),
                    totalHotels,
                    hasNext: page * limit < totalHotels,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get hotels error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching hotels"
        });
    }
};

// Approve/Reject Hotel
export const updateHotelStatus = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const { isApproved, rejectionReason } = req.body;

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        hotel.isApproved = isApproved;
        if (!isApproved && rejectionReason) {
            hotel.rejectionReason = rejectionReason;
        }

        await hotel.save();

        res.json({
            success: true,
            message: `Hotel ${isApproved ? 'approved' : 'rejected'} successfully`,
            hotel
        });

    } catch (error) {
        console.error('Update hotel status error:', error);
        res.status(500).json({
            success: false,
            message: "Error updating hotel status"
        });
    }
};

// Delete Hotel
export const deleteHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;

        // Check if hotel has active bookings
        const activeBookings = await Booking.find({
            hotel: hotelId,
            status: { $in: ['pending', 'confirmed'] },
            checkOutDate: { $gte: new Date() }
        });

        if (activeBookings.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete hotel with active bookings"
            });
        }

        // Delete hotel and all its rooms
        await Hotel.findByIdAndDelete(hotelId);
        await Room.deleteMany({ hotel: hotelId });

        res.json({
            success: true,
            message: "Hotel and associated rooms deleted successfully"
        });

    } catch (error) {
        console.error('Delete hotel error:', error);
        res.status(500).json({
            success: false,
            message: "Error deleting hotel"
        });
    }
};

// Get System Analytics
export const getSystemAnalytics = async (req, res) => {
    try {
        const { period = '30' } = req.query; // days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        // User growth
        const userGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        // Booking trends
        const bookingTrends = await Booking.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalPrice" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        // Revenue by status
        const revenueByStatus = await Booking.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        // Top cities
        const topCities = await Hotel.aggregate([
            { $match: { isApproved: true } },
            {
                $group: {
                    _id: "$city",
                    hotelCount: { $sum: 1 }
                }
            },
            { $sort: { hotelCount: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            success: true,
            data: {
                userGrowth,
                bookingTrends,
                revenueByStatus,
                topCities
            }
        });

    } catch (error) {
        console.error('System analytics error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching system analytics"
        });
    }
};
