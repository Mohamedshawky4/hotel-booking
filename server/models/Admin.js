import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['super_admin', 'admin', 'moderator'],
        default: 'admin'
    },
    permissions: {
        userManagement: { type: Boolean, default: true },
        hotelManagement: { type: Boolean, default: true },
        contentModeration: { type: Boolean, default: true },
        analytics: { type: Boolean, default: true },
        systemSettings: { type: Boolean, default: false }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    profile: {
        firstName: String,
        lastName: String,
        avatar: String,
        phone: String
    }
}, {
    timestamps: true
});

// Add indexes for better performance
AdminSchema.index({ email: 1 });
AdminSchema.index({ username: 1 });
AdminSchema.index({ role: 1 });

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;
