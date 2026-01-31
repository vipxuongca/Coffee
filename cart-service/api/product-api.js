import dotenv from 'dotenv';
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });
import apiAuth from './baseAuth.js'

const BASE = process.env.API_PRODUCT;
// http://locahost:4000/api/product

export const productApi = {
  getProduct(page, limit) {
    return apiAuth.get(`${BASE}/get`,
      {
        params: { page, limit }
      }
    );
  },

  getOneProduct(productId) {
    return apiAuth.get(`${BASE}/fetch/${productId}`);
  },

  stockVerify(productId, quantity) {
    return apiAuth.post(`${BASE}/stock/single/${productId}`, { quantity });
  }
};