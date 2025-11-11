import apiAuth from "./baseAuth.js";
import dotenv from 'dotenv';
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

const BASE = process.env.API_CART
// http://localhost:4003/api/cart/order
// exclusive API for order access

export const cartApi = {
  clearCartFromOrder(userId) {
    const url = `${BASE}/clear`;
    // console.log(url)
    return apiAuth.put(url, { userId });
  },
};