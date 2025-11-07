import apiAuth from "./baseAuth";

const BASE = import.meta.env.VITE_API_ORDER;
// Example: http://localhost:4004/api/order

export const orderApi = {
  createOrder(orderData) {
    return apiAuth.post(`${BASE}/create`, orderData);
  },

  getOneOrder(orderId) {
    return apiAuth.get(`${BASE}/get-one/${orderId}`);
  },

  getUserOrders() {
    return apiAuth.get(`${BASE}/get-user`);
  },

  cancelOrder(orderId) {
    return apiAuth.put(`${BASE}/cancel/${orderId}`);
  }
};
