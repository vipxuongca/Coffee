import axios from 'axios';

const apiPublic = axios.create({
  withCredentials: false,
  headers: {
    "Content-Type": "application/json"
  }
});

const BASE = import.meta.env.VITE_API_PRODUCT;
// http://locahost:4000/api/product

export const productApi = {
  getProduct() {
    return apiPublic.get(`${BASE}/get`);
  },

  getOneProduct(productId) {
    return apiPublic.get(`${BASE}/fetch/${productId}`);
  },

  stockVerify(productId, quantity) {
    return apiPublic.post(`${BASE}/stock/${productId}`, { quantity });
  }
};