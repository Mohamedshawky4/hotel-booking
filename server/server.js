import express from 'express';
import cors from 'cors';
import connectDB from "./configs/db.js";
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhook from './controllers/clerkWebhooks.js';
import bodyParser from 'body-parser';

dotenv.config();
connectDB();

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
