import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/user-route.js';

//initialisation
dotenv.config({ path: '.env.development' });

// configuration
const app = express();
const PORT = process.env.PORT || 4002;
connectDB();
connectCloudinary();

//middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

//api endpoint
app.use('/api/user', userRouter);

//start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 