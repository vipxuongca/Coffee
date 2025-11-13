import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../../context/ShopContext";
import Title from "./Title";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 20));
  }, [products]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -clientWidth : clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative my-10">
      {/* Header */}
      <div className="text-center text-3xl py-8">
        <Title text1="BÁN CHẠY " text2="NHẤT" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-700">
          Thử để cảm nhận sự khác biệt — những hạt cà phê được yêu thích nhất tại Velvet Roast.
        </p>
      </div>

      {/* Scroll Buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Product Scroll Section */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-8 scroll-smooth"
      >
        {bestSeller.map((item) => (
          <Link
            key={item._id}
            to={`/product/${item._id}`}
            className="snap-start flex-shrink-0 w-[10rem] sm:w-[12rem] md:w-[14rem]"
          >
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group cursor-pointer">
              <ProductCard product={item} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
