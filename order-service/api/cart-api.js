import apiAuth from "./baseAuth";

const BASE = process.env.API_CART
// http://localhost:4003/api/cart

export const cartApi = {
  clearCart() {
    return apiAuth.delete(`${BASE}/clear`);
  },
};