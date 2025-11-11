// environment
import dotenv from 'dotenv';
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

//tools
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import stripeRouter from './routes/stripe-route.js';

//initialisation
const app = express();
const PORT = process.env.PORT || 4008;
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

// use json for the whole application, this automatically parse JSON into objects
app.use(bodyParser.json()); 

// Routes listing
app.use('/api/stripe', stripeRouter);


app.listen(PORT, () => console.log(`PAYMENT running on port: http://localhost:${PORT}`));