import dotenv from 'dotenv';
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import cookieParser from 'cookie-parser';


import adminRouter from './routes/admin-route.js';
import productRouter from './routes/product-route.js';
import categoryRouter from './routes/category-route.js';

// configuration
const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 4000;
connectDB();
connectCloudinary();


//middlewares
app.use(express.json());
app.use(bodyParser.json());
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

//api endpoint
app.use('/api/admin', adminRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);


//start the server
app.listen(PORT, () => {
    console.log(`ADMIN is running on http://localhost:${PORT}`);
}); 