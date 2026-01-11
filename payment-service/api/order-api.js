import dotenv from 'dotenv';
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });
import apiAuth from './baseAuth.js'

const BASE = process.env.API_ORDER;
// http://locahost:4004/api/order

export const orderApi = {
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
    return apiAuth.post(`${BASE}/stock/${productId}`, { quantity });
  }
};