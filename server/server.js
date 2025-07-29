import express from 'express';
import cors from 'cors';
import connectDB from "./configs/db.js";
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhook from './controllers/clerkWebhooks.js';
import bodyParser from 'body-parser';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

dotenv.config();
connectDB();
connectCloudinary();
const app = express();
app.use(cors());

// ✅ Raw body parser only for Clerk webhook route
app.use('/api/clerk', bodyParser.raw({ type: '*/*' }));

// ✅ Clerk auth middleware (optional for protected routes)
app.use(clerkMiddleware());

// ✅ General JSON parsing (AFTER the webhook route)
app.use(express.json());

// ✅ Clerk Webhook Endpoint
app.post("/api/clerk", clerkWebhook);

// ✅ Basic Route
app.get('/', (req, res) => {
  res.send('API is running');
});
app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
