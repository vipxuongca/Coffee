import dotenv from 'dotenv';
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

// api/product.js
const BASE_PRODUCT = process.env.API_PRODUCT;

export const productApi = {
  delete: `${BASE_PRODUCT}/delete`,
  list: `${BASE_PRODUCT}`,
  create: `${BASE_PRODUCT}/create`,
  getOneProduct: `${BASE_PRODUCT}/fetch`//with id passed by the controller
};