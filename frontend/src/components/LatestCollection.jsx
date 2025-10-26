import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import { Link } from "react-router-dom";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1="Sản phẩm " text2="Mới nhất" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-700">
          Cà phê ngon nhất thế giới — rang xay thủ công, hương vị đậm đà và tinh tế.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
        {latestProducts.map((item) => (
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
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
