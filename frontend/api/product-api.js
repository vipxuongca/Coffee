import axios from 'axios';

const apiPublic = axios.create({
  withCredentials: false,
  headers: {
    "Content-Type": "application/json"
  }
});

const BASE = import.meta.env.VITE_API_PRODUCT;
const BASE_CAT = import.meta.env.VITE_API_CATEGORY;
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

export const categoryApi = {
  getCategory() {
    return apiPublic.get(`${BASE_CAT}/get`);
  },

  getOneProduct(productId) {
    return apiPublic.get(`${BASE_CAT}/fetch/${productId}`);
  },

  stockVerify(productId, quantity) {
    return apiPublic.post(`${BASE_CAT}/stock/${productId}`, { quantity });
  }
};