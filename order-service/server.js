// environment
import dotenv from 'dotenv';
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

//tools
import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";

//modules
import connectDB from './config/mongodb.js'

//routing modules
// routing for
import orderCreate from './routes/orders/order-create.js';
import orderGetOne from './routes/orders/order-get-one.js';
import orderGetUser from './routes/orders/order-get-user.js';

//initialisation
const app = express();
const PORT = process.env.PORT || 6006;
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
app.use('/api/order/create', orderCreate);
app.use('/api/order/get-one', orderGetOne);
app.use('/api/order/get-user', orderGetUser);

//listen
app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));