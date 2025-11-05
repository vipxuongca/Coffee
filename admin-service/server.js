import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/admin-route.js';
import productRouter from './routes/product-route.js';
import categoryRouter from './routes/category-route.js';

//initialisation
dotenv.config({ path: '.env.development' });

// configuration
const app = express();
const PORT = process.env.PORT || 4000;
connectDB();
connectCloudinary();


//middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

//api endpoint
app.use('/api/admin', adminRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);


//start the server
app.listen(PORT, () => {
    console.log(`ADMIN is running on http://localhost:${PORT}`);
}); 