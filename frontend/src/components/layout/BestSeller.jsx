import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import Title from "./Title";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <div className="my-10">
      {/* Header */}
      <div className="text-center text-3xl py-8">
        <Title text1="BÁN CHẠY " text2="NHẤT" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-700">
          Thử để cảm nhận sự khác biệt — những hạt cà phê được yêu thích nhất
          tại Velvet Roast.
        </p>
      </div>

      {/* Product Grid */}
      <div
        className="grid gap-3 sm:gap-4 place-items-center justify-center my-6
                   grid-cols-[repeat(auto-fit,minmax(18rem,max-content))]
                   rounded-none"
      >
        {bestSeller.map((item) => (
          <Link
            key={item._id}
            to={`/product/${item._id}`}
            className="flex justify-center rounded-none"
          >
            <ProductCard product={item} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
