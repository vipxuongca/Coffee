import apiAuth from "./baseAuth";
import axios from 'axios';

const BASE = import.meta.env.VITE_API_USER;
const BASE_DETAIL = import.meta.env.VITE_API_USERDETAIL;
/*
VITE_API_USER=http://localhost:4002/api/user
VITE_API_USERDETAIL=http://localhost:4002/api/user-detail
*/
const apiPublic = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export const userApi = {
  // public APIs, no authentication
  login(email, password) {
    return apiPublic.post(`${BASE}/login`, { email, password });
  },

  register(email, password) {
    return apiPublic.post(`${BASE}/register`, { email, password });
  },

  // Authenticated API
  logout() {
    return apiAuth.post(`${BASE}/logout`, {});
  },

  single() {
    return apiAuth.get(`${BASE}/single`);
  }
};

export const userDetailApi = {
  createAddress(newAddress) {
    return apiAuth.post(`${BASE_DETAIL}/add`, newAddress)
  },
  getAllAddress() {
    return apiAuth.get(`${BASE_DETAIL}/`);
  },

  getDefaultAddress() {
    return apiAuth.get(`${BASE_DETAIL}/default`);
  },

  updateAddress(id, data) {
    return apiAuth.post(`${BASE_DETAIL}/edit/${id}`, data);
  },

  deleteAddress(id) {
    return apiAuth.delete(`${BASE_DETAIL}/delete/${id}`);
  },

  setDefaultAddress(id) {
    return apiAuth.patch(`${BASE_DETAIL}/default/${id}`);
  }
};

