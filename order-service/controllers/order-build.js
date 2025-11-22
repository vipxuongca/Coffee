import { userApi, detailApi } from "../api/user-api.js";
import { productApi } from "../api/product-api.js";

/* ----------------------- CONFIG ----------------------- */
// const SERVICE_URLS = {
//   user: process.env.USER_URL,
//   userDetail: process.env.USER_DETAIL_URL,
//   product: process.env.PRODUCT_URL,
// };

/* ----------------------- FETCHERS ----------------------- */
async function fetchProducts(items) {
  const productPromises = items.map(async (item) => {
    const res = await productApi.getOneProduct(item.productId);
    if (!res || !res.data || !res.data.product) return null;

    return {
      ...res.data.product, // real product fields
      quantity: item.quantity,
    };
  });

  const results = await Promise.all(productPromises);
  return results.filter(Boolean);
}



/* ----------------------- BUILDER ----------------------- */
export async function buildOrderData(items, userId) {
  try {
    const [uRes, detailRes] = await Promise.all([
      userApi.single(userId),
      detailApi.getDefaultAddress(userId),
    ]);
    const productRes = await fetchProducts(items);

    // pack user information (id and email)
    const { _id, email } = uRes.data.data;
    const user = { _id, email };

    // pack user detail
    const userDetail = detailRes.data;

    // pack products
    const products = productRes;

    // if (!user || !userDetail || products.length === 0)
    //   throw new Error("Không đủ dữ liệu tạo đơn hàng");

    // console.log("Dữ liệu đơn hàng như sau");
    // console.log("user: ", user)
    // console.log("userDetail: ", userDetail)
    // console.log("products: ", products)

    return {
      user,
      userDetail,
      products,
    };
  } catch (err) {
    console.error("Xảy ra lỗi khi tạo dữ liệu đơn hàng:", err.message);
    throw err;
  }
}
