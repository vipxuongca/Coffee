import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import ProductItem from "../ProductItem";
import Title from "./Title";
import { Link } from "react-router-dom";

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0 && category && subCategory) {
      let filtered = products.filter(
        (item) => item.category === category && item.subCategory === subCategory
      );
      setRelated(filtered.slice(0, 5));
    }
  }, [products, category, subCategory]);

  return (
    <div className="my-24">
      {/* Section Title */}
      <div className="text-center mb-10">
        <Title text1="SẢN PHẨM " text2="TƯƠNG TỰ" />
        <p className="text-gray-500 text-sm mt-2">
          Gợi ý sản phẩm tương tự dành cho bạn
        </p>
      </div>

      {/* Product Grid */}
      {related.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {related.map((item) => (
            <Link to={"/product/" + item._id}>
              <div
                key={item._id}
                className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={Array.isArray(item.image) ? item.image[0] : item.image}
                    alt={item.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4 text-center">
                  <h3 className="text-gray-800 font-medium truncate">
                    {item.name}
                  </h3>
                  <p className="text-amber-700 font-semibold mt-2">
                    {item.price.toLocaleString()}₫
                  </p>
                  <button className="mt-4 px-4 py-2 w-full bg-[#3e2723] text-white text-sm rounded-lg hover:bg-gray-800 transition-colors duration-150">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          Không có sản phẩm liên quan.
        </p>
      )}
    </div>
  );
};

export default RelatedProducts;
