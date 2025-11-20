import dotenv from 'dotenv';
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

// api/product.js
const BASE_PRODUCT = process.env.API_PRODUCT;

export const productApi = {
  delete: `${BASE_PRODUCT}/api/product/delete`,
  list: `${BASE_PRODUCT}/api/product`,
  create: `${BASE_PRODUCT}/api/product/create`,
  getOneProduct: `${BASE_PRODUCT}/api/product/fetch`//with id passed by the controller
};