import express from 'express';
import {server,app,io} from "./lib/socket.js"
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import {connectDB} from "./lib/db.js";

const PORT = process.env.PORT || 3000;

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

server.listen(PORT,()=>{
    console.log(`server is running on port: ${PORT}`);
    connectDB();
});

