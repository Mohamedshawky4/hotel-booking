import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'admin-secret-key');
        
        const admin = await Admin.findById(decoded.adminId);
        if (!admin || !admin.isActive) {
            return res.status(401).json({
                success: false,
                message: "Invalid token or admin account inactive."
            });
        }

        req.admin = admin;
        req.adminPermissions = decoded.permissions;
        next();

    } catch (error) {
        console.error('Admin auth error:', error);
        res.status(401).json({
            success: false,
            message: "Invalid token."
        });
    }
};

// Check specific permissions
export const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.adminPermissions || !req.adminPermissions[permission]) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Insufficient permissions."
            });
        }
        next();
    };
};

// Check if admin has any of the required permissions
export const requireAnyPermission = (permissions) => {
    return (req, res, next) => {
        const hasPermission = permissions.some(permission => 
            req.adminPermissions && req.adminPermissions[permission]
        );
        
        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Insufficient permissions."
            });
        }
        next();
    };
};
