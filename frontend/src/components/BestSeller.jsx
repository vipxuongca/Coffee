import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import { Link } from "react-router-dom";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1="BÁN CHẠY " text2="NHẤT" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-700">
          Thử để cảm nhận sự khác biệt — những hạt cà phê được yêu thích nhất tại Velvet Roast.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 my-6">
        {bestSeller.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            <Link to={`/product/${item._id}`}>
              {/* Image */}
              <div className="relative">
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col items-start">
                <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate w-full">
                  {item.name}
                </h3>
                <p className="text-amber-700 font-semibold mt-2 text-sm md:text-base">
                  {item.price.toLocaleString()} ₫
                </p>

                <button className="mt-3 w-full bg-amber-600 text-white py-2 rounded-lg text-sm hover:bg-amber-700 transition-colors duration-300">
                  Thêm vào giỏ
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
