import apiAuth from "./baseAuth";

const BASE = import.meta.env.VITE_API_ORDER;
// Example: http://localhost:4004/api/order/admin

export const orderApi = {

  getAllOrder() {
    return apiAuth.get(`${BASE}/get`);
  },

  getOneOrder(orderId) {
    return apiAuth.get(`${BASE}/get-one/${orderId}`)
  },

  confirmPayment(orderId) {
    return apiAuth.put(`${BASE}/confirm-payment/${orderId}`);
  },

  cancelOrder(orderId) {
    return apiAuth.put(`${BASE}/cancel/${orderId}`);
  }
};