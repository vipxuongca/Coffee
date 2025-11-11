import axios from "axios";

const api = axios.create();

api.interceptors.request.use(config => {
  const serviceKey = process.env.ORDER_SECRET_KEY; // set in environment
  config.headers.Authorization = `Bearer ${serviceKey}`;
  return config;
});

export default api;
