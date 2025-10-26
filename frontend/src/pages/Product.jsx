import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, backendCartUrl, fetchCartCount, token } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Add to cart API
  const cartAdd = async (productId, quantity) => {
    try {
      const res = await axios.post(
        `${backendCartUrl}/api/cart/add/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Cart updated:", res.data);
      await fetchCartCount();
      toast.success("Thêm vào giỏ hàng thành công");
    } catch (err) {
      console.error("Cart API error:", err.response?.data || err.message);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  // Load product data
  useEffect(() => {
    if (!productId || !Array.isArray(products) || products.length === 0) return;
    const item = products.find((p) => String(p._id) === String(productId));
    if (item) {
      setProductData(item);
      setImage(Array.isArray(item.image) ? item.image[0] : item.image || "");
    }
  }, [products, productId]);

  const handleAddToCart = async () => {
    if (!productData?._id) return;
    await cartAdd(productData._id, quantity);
  };

  if (!productData) {
    return (
      <div className="text-center py-20 text-gray-500 animate-pulse">
        Đang tải sản phẩm...
      </div>
    );
  }

  return (
    <div className="border-t pt-10 px-4 sm:px-10 transition-opacity duration-500">
      <div className="flex flex-col sm:flex-row gap-10">
        {/* Image Section */}
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          {/* Thumbnail list */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto gap-2 sm:w-[18%] w-full">
            {productData.image?.map((item, index) => (
              <img
                key={index}
                src={item}
                onClick={() => setImage(item)}
                alt="Product thumbnail"
                className={`cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                  image === item ? "border-amber-700" : "border-transparent"
                } hover:opacity-80`}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="w-full sm:w-[80%] flex justify-center">
            <img
              src={image}
              alt={productData.name}
              className="w-full max-h-[600px] object-contain rounded-2xl shadow-md transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            {productData.name}
          </h1>

          <div className="flex items-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <img key={i} src={assets.star_icon} alt="star" className="w-4 h-4" />
            ))}
            <p className="pl-2 text-gray-600 text-sm">(120 đánh giá)</p>
          </div>

          <p className="mt-5 text-3xl font-semibold text-gray-900">
            {productData.price.toLocaleString()} {currency}
          </p>

          <p className="mt-5 text-gray-600 leading-relaxed">
            {productData.description}
          </p>

          <p className="mt-8 font-medium text-gray-500 text-sm">
            {productData.stock} sản phẩm có sẵn
          </p>

          {/* Quantity Selector */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-gray-700 font-medium">Số lượng:</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 text-gray-700 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 text-gray-800 select-none">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((q) =>
                    Math.min(productData.stock || 99, q + 1)
                  )
                  
                }
                className="px-3 py-1 text-gray-700 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="mt-8 w-fit bg-[#3e2723] text-white px-10 py-3 text-sm rounded-lg shadow hover:bg-gray-800 active:scale-95 transition-transform duration-100"
          >
            THÊM VÀO GIỎ
          </button>

          <div className="mt-8 text-sm text-gray-500 border-t pt-4 space-y-1">
            <p>Chính sách đổi trả rõ ràng</p>
            <p>Hỗ trợ khách hàng 24/7</p>
          </div>
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="mt-20">
        <div className="flex border-b">
          <b className="border px-5 py-3 text-sm bg-gray-100">Mô tả</b>
          <p className="border px-5 py-3 text-sm text-gray-500">
            Đánh giá (122)
          </p>
        </div>
        <div className="border-x border-b px-6 py-6 text-sm text-gray-600 space-y-3 leading-relaxed">
          <p>{productData.description || "Không có mô tả chi tiết."}</p>
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
