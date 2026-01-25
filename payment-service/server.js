// environment
import dotenv from 'dotenv';
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

// tools
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// modules
import connectDB from './config/mongodb.js';

// routes
import momoRouter from './routes/momo-route.js';

// initialisation
const app = express();
const PORT = process.env.PORT || 4008;

// CORS configuration
// Nginx already enforces same-origin, so do NOT throw errors here
const corsOptions = {
  origin: true,          // reflect request origin
  credentials: true,
};

// middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

connectDB();

app.use(bodyParser.json());

// routes
app.use('/api/momo', momoRouter);

// start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`PAYMENT is running on http://0.0.0.0:${PORT}`);
});
