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

  useEffect(() => {
    if (!productId || !Array.isArray(products) || products.length === 0) return;
    const item = products.find((p) => String(p._id) === String(productId));
    if (item) {
      setProductData(item);
      setImage(Array.isArray(item.image) ? item.image[0] : item.image || "");
    }
  }, [products, productId]);

  if (!productData) {
    return (
      <div className="text-center py-20 text-gray-500 animate-pulse">
        Loading product...
      </div>
    );
  }

  return (
    <div className="border-t pt-10 px-4 sm:px-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Section */}
      <div className="flex flex-col sm:flex-row gap-10">
        {/* Image Gallery */}
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto gap-2 sm:w-[18%] w-full">
            {productData.image.map((item, index) => (
              <img
                key={index}
                src={item}
                onClick={() => setImage(item)}
                className={`cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                  image === item ? "border-black" : "border-transparent"
                } hover:opacity-80`}
                alt=""
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="w-full sm:w-[80%] flex justify-center">
            <img
              className="w-full max-h-[600px] object-contain rounded-2xl shadow-md transition-transform duration-300 hover:scale-105"
              src={image}
              alt={productData.name}
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            {productData.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={assets.star_icon}
                alt="star"
                className="w-4 h-4"
              />
            ))}
            <p className="pl-2 text-gray-600 text-sm">(120 reviews)</p>
          </div>

          {/* Price */}
          <p className="mt-5 text-3xl font-semibold text-gray-900">
            {productData.price.toLocaleString()}
            {currency}
          </p>

          {/* Description */}
          <p className="mt-5 text-gray-600 leading-relaxed">
            {productData.description}
          </p>

          {/* Variants */}
          <div className="mt-8">
            <p className="font-medium mb-2 text-sm">Variant</p>
            {/* Placeholder for variants */}
            {/* Uncomment if needed */}
            {/* <div className="flex gap-2">
              {productData.variants.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setVariants(item)}
                  className={`px-4 py-2 border rounded-md text-sm transition ${
                    variants === item
                      ? "border-black bg-gray-100"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div> */}
          </div>

          {/* Add to Cart */}
          <button className="mt-8 w-fit bg-black text-white px-10 py-3 text-sm rounded-lg shadow hover:bg-gray-800 active:scale-95 transition-transform duration-100">
            ADD TO CART
          </button>

          {/* Extra Info */}
          <div className="mt-8 text-sm text-gray-500 border-t pt-4 space-y-1">
            <p>Ngon</p>
            <p>Bổ</p>
            <p>Rẻ</p>
          </div>
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="mt-20">
        <div className="flex border-b">
          <b className="border px-5 py-3 text-sm bg-gray-100">Description</b>
          <p className="border px-5 py-3 text-sm text-gray-500">
            Reviews (122)
          </p>
        </div>
        <div className="border-x border-b px-6 py-6 text-sm text-gray-600 space-y-3 leading-relaxed">
          <p>fdfewqafesa</p>
          <p>fjioahfioewahfuiewahf8u9ewah</p>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-20">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  );
};

export default Product;
