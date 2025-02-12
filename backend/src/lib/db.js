import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AppError from "../utils/AppError.js";
dotenv.config();

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }catch (error)
    {
        throw new AppError('MongoDB connection error');
    }
}