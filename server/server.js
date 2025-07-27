import express from 'express';
import cors from 'cors';
import connectDB from "./configs/db.js";
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhook from './controllers/clerkWebhooks.js';
dotenv.config();
console.log(process.env.MONGODB_URI);
console.log("CLERK_PUBLISHABLE_KEY:", process.env.CLERK_PUBLISHABLE_KEY);

connectDB();

const app = express();
app.use(cors()); //cross origin resource sharing
//middleware
app.use(clerkMiddleware())
app.use(express.json());
//api for clerck web hook
app.use("/api/clerk", clerkWebhook);
app.get('/', (req, res) => {
    res.send('api is running ');
});
const PORT=process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

