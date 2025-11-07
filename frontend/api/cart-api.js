import apiAuth from "./baseAuth";

const BASE = import.meta.env.VITE_API_CART;
// http://localhost:4003/api/cart

export const cartApi = {
  getCart() {
    return apiAuth.get(`${BASE}/`);
  },

  addCart(productId, quantity) {
    return apiAuth.post(`${BASE}/add/${productId}`, { quantity });
  },

  clearCart() {
    return apiAuth.delete(`${BASE}/clear`);
  },

  removeItem(productId) {
    return apiAuth.delete(`${BASE}/remove/${productId}`);
  },

  decreaseItem(productId) {
    return apiAuth.put(`${BASE}/update/decrease/${productId}`);
  },

  increaseItem(productId) {
    return apiAuth.put(`${BASE}/update/${productId}`);
  },

  updateQuantity(productId, quantity) {
    return apiAuth.put(`${BASE}/update/quantity/${productId}`, { quantity });
  }
};