// environment
import dotenv from 'dotenv';
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });


import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './config/mongodb.js';

import userRouter from './routes/frontend/user-route.js';
import detailRouter from './routes/frontend/detail-route.js';

import userOrderRouter from './routes/order-service/user-order-route.js';
import detailOrderRouter from './routes/order-service/detail-order-route.js';


// configuration
const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 4002;

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

//middlewares
app.use(express.json());
app.use(bodyParser.json());
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

//api endpoint for frontend
app.use('/api/user', userRouter);
app.use('/api/detail', detailRouter);

// following enpoints are for order service, which is to be used internally
// which means they do not rely on token to get user ID
// these endpoints are the same as the frontend counterparts
// but userId is required to be passed as payloads

app.use('/api/user/order', userOrderRouter);
app.use('/api/detail/order', detailOrderRouter);

//start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`USER is running on http://0.0.0.0:${PORT}`);
});
