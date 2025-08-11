import {v2 as cloudinary} from 'cloudinary';
const connectCloudinary=async ()=>{
    try {
        // Only configure Cloudinary if environment variables are set
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            });
            console.log('Cloudinary configured successfully');
        } else {
            console.log('Cloudinary environment variables not set - image uploads will not work');
        }
    } catch (error) {
        console.log('Cloudinary configuration error:', error);
    }
    
}
export default connectCloudinary