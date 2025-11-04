// environment
import dotenv from 'dotenv';
dotenv.config({ path: envFile });
import express from "express";
import cors from "cors";
import dotenv from "dotenv";


import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/user-route.js';


// configuration
const app = express();
const PORT = process.env.PORT || 4002;
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

const allowedOrigins = process.env.ALLOWED_ORIGIN
  ? process.env.ALLOWED_ORIGIN.split(',').map(o => o.trim())
  : [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

connectDB();
connectCloudinary();

//middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use("/api/auth", authRoutes);

//api endpoint
app.use('/api/user', userRouter);

//start the server
app.listen(PORT, () => {
    console.log(`USER is running on http://localhost:${PORT}`);
}); 