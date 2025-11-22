import apiAuth from "./baseAuth.js";
import dotenv from 'dotenv';
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });
const BASE = process.env.API_USER;
const BASE_DETAIL = process.env.API_DETAIL;

/*
API_USER=http://localhost:4002/api/user/order
API_DETAIL=http://localhost:4002/api/user-detail/order
*/

export const userApi = {
  // public APIs, no authentication
  single(userId) {
    return apiAuth.post(`${BASE}/single`, { userId });
  }
};

export const detailApi = {
  getDefaultAddress(userId) {
    return apiAuth.post(`${BASE_DETAIL}/default`, { userId });
  }
};

