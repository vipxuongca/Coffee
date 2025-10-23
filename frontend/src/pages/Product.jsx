import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import { assets } from "../assets/assets";

const Product = () => {
  const { productId } = useParams();
  const { products, currency } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [variants, setVariants] = useState("");

  const fetchProductDetails = () => {
    console.log("product id from param: " + productId);
    console.log("products are: " + products);
    const item = products.find((p) => p._id === productId);
    console.log(`item: ${item}`);
    if (item) {
      setProductData(item);
      setImage(item.image[0]);
    } else {
      console.log("error");
    }
  };

  useEffect(() => {

    // no product ID, no array, no product, do not go into this, return right away
    if (!productId || !Array.isArray(products) || products.length === 0) return;

    // test logging
    // console.log("productId (raw):", productId, " typeof:", typeof productId);
    // console.log("products length:", products.length);

    const item = products.find((p) => String(p._id) === String(productId));// make it explicitly string

    // console.log("found item:", item);

    if (item) {
      setProductData(item);
      setImage(Array.isArray(item.image) ? item.image[0] : item.image || "");
    } else {
      // optional fallback: attempt to fetch single product from backend if not found in context
      console.log("product not found in context; leaving productData false");
    }
  }, [products, productId]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Img */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>

          <div className="w-full sm:w-[80%]">
            <img className=" w-full h-auto" src={image} alt="" />
          </div>
        </div>

        {/* Product Information */}
        <div className="flex-1">
          <h1 className="font-medium- text-2x1 mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <p className="pl-2">(120)</p>
          </div>
          <p className="mt-5 text-3x1 font-medium">
            {productData.price}
            {currency}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Variant</p>
            {/* <div className="flex gap-2">
              {productData.variants.map((item, index) => (
                <button
                  onClick={() => setVariants(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === variants ? "border-orange-500" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div> */}
          </div>

          <button className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700">
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>Ngon</p>
            <p>Bổ</p>
            <p>Rẻ</p>
          </div>
        </div>
      </div>

      {/* Description, review  */}

      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>fdfewqafesa</p>
          <p>fjioahfioewahfuiewahf8u9ewah</p>
        </div>
      </div>

      {/* Related Product */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0">
      <p>none</p>
    </div>
  );
};

export default Product;
