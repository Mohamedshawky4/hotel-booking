import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import connectDB from '../configs/db.js';

const createDefaultAdmin = async () => {
    try {
        await connectDB();
        
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@hotelbooking.com' });
        if (existingAdmin) {
            console.log('Default admin already exists');
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('admin123', 12);

        // Create default admin
        const admin = new Admin({
            username: 'admin',
            email: 'admin@hotelbooking.com',
            password: hashedPassword,
            role: 'super_admin',
            permissions: {
                userManagement: true,
                hotelManagement: true,
                contentModeration: true,
                analytics: true,
                systemSettings: true
            },
            profile: {
                firstName: 'Admin',
                lastName: 'User'
            }
        });

        await admin.save();
        console.log('Default admin created successfully');
        console.log('Email: admin@hotelbooking.com');
        console.log('Password: admin123');

    } catch (error) {
        console.error('Error creating admin:', error);
    }
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    createDefaultAdmin();
}

export default createDefaultAdmin;
