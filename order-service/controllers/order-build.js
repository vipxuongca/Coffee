import axios from "axios";

/* ----------------------- CONFIG ----------------------- */
// const SERVICE_URLS = {
//   user: process.env.USER_URL,
//   userDetail: process.env.USER_DETAIL_URL,
//   product: process.env.PRODUCT_URL,
// };

const SERVICE_URLS = {
  user: "http://localhost:4002",
  userDetail: "http://localhost:4002",
  product: "http://localhost:4000",
};

/* ----------------------- HELPERS ----------------------- */
async function safeGet(url, token, label) {
  try {
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // return the first actual payload key if known
    return res.data?.product || res.data?.data || res.data;
  } catch (err) {
    console.error(`Error fetching ${label}:`, err.message);
    return null;
  }
}

/* ----------------------- FETCHERS ----------------------- */
async function fetchUser(token) {
  return await safeGet(`${SERVICE_URLS.user}/api/user/single`, token, "User");
}

async function fetchUserDetail(token) {
  return await safeGet(`${SERVICE_URLS.userDetail}/api/user-detail/default`, token, "UserDetail");
}

async function fetchProducts(items, token) {
  const productPromises = items.map(async (item) => {
    const product = await safeGet(
      `${SERVICE_URLS.product}/api/product/fetch/${item.productId}`,
      token,
      `Product ${item.productId}`
    );

    // console.log(`${SERVICE_URLS.product}/api/product/fetch/${item.productId}`);

    if (!product) return null;

    // Merge quantity into the full product object
    return {
      ...product,
      quantity: item.quantity,
    };
  });

  const results = await Promise.all(productPromises);
  return results.filter(Boolean);
}


/* ----------------------- BUILDER ----------------------- */
export async function buildOrderData(items, token) {
  try {
    const [user, userDetail, products] = await Promise.all([
      fetchUser(token),
      fetchUserDetail(token),
      fetchProducts(items, token),
    ]);

    if (!user || !userDetail || products.length === 0)
      throw new Error("Incomplete order data");

    return {
      user,
      userDetail,
      products,
    };
  } catch (err) {
    console.error("Error building order data:", err.message);
    throw err;
  }
}
