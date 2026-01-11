import dotenv from 'dotenv';
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });
import apiAuth from "./baseAuth.js";

const BASE = process.env.API_PAYMENT;
// http://localhost:4008/api/

export const paymentApi = {
  stripe() {
    return apiAuth.post(`${BASE}/stripe`);
  },
  momo() {
    return apiAuth.post(`${BASE}/momo`);
  },
};