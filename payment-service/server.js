// environment
import dotenv from 'dotenv';
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });


//tools
import express from 'express';
import bodyParser from 'body-parser';

//modules
import connectDB from './config/db.js'

//routing modules
// import userMeRoutes from './routes/users/users-me.js';


//initialisation

const app = express();
const PORT = process.env.PORT || 4008;
connectDB();

// use json for the whole application, this automatically parse JSON into objects
app.use(bodyParser.json()); 

// Routes listing



app.listen(PORT, () => console.log(`PAYMENT running on port: http://localhost:${PORT}`));