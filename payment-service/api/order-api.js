import dotenv from 'dotenv';
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });
import axios from "axios";

const api = axios.create();

const BASE = process.env.API_ORDER;
// http://locahost:4004/api/order

export const orderApi = {
  momoResult(data) {
    const url = `${BASE}/momo/success`;
    console.log("url", url);
    return api.post(url, data);
  },
};