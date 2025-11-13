import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../../context/ShopContext";
import Title from "./Title";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    setLatestProducts(products.slice(0, 20));
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
      <div className="text-center py-8 text-3xl">
        <Title text1="SẢN PHẨM " text2="MỚI NHẤT" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-700">
          Cà phê ngon nhất thế giới — rang xay thủ công, hương vị đậm đà và tinh
          tế.
        </p>
      </div>

      {/* Scroll Buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2  z-10 hover:bg-gray-100"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2  z-10 hover:bg-gray-100"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Product Scroll Section */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-8 scroll-smooth"
      >
        {latestProducts.map((item) => (
          <Link
            key={item._id}
            to={`/product/${item._id}`}
            className="snap-start flex-shrink-0"
          >
            <div className="w-fit bg-white border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group cursor-pointer">
              <ProductCard product={item} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
