import apiAuth from "./baseAuth.js";

const BASE = process.env.API_PAYMENT
// http://localhost:4008/api/

export const paymentApi = {
  stripe() {
    return apiAuth.post(`${BASE}/stripe`);
  },
};