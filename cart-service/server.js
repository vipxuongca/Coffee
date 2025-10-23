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
// routing for cart
import cartRoutes from './routes/cart-get.js';
import cartAddRoutes from './routes/cart-add-product.js';
import cartUpdateProductIncreaseQuantity from './routes/cart-update-product-increase-quantity.js';
import cartUpdateProductDecreaseQuantity from './routes/cart-update-product-decrease-quantity.js';
import cartRemoveProductRoutes from './routes/cart-remove-product.js';
import cartClearRoutes from './routes/cart-clear.js';

//initialisation
const app = express();
const PORT = process.env.PORT || 6002;
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
// CART
app.use('/api/cart', cartRoutes);
app.use('/api/cart/add', cartAddRoutes); // with body of quantity
app.use('/api/cart/update/', cartUpdateProductIncreaseQuantity);
app.use('/api/cart/update/decrease/', cartUpdateProductDecreaseQuantity);
app.use('/api/cart/remove/', cartRemoveProductRoutes);
app.use('/api/cart/clear', cartClearRoutes);

//listen
app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));