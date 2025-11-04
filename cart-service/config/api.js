// api/product.js
const BASE_PRODUCT_URL = 'http://localhost:4000';

export const productApi = {
  delete: `${BASE_PRODUCT_URL}/api/product/delete`,
  list: `${BASE_PRODUCT_URL}/api/product`,
  create: `${BASE_PRODUCT_URL}/api/product/create`,
  getOneProduct: ` ${BASE_PRODUCT_URL}/api/product/fetch`//with id passed by the controller
};