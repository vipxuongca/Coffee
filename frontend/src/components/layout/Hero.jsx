import React from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center bg-gradient-to-r from-amber-50 to-amber-100  overflow-hidden shadow-md my-6">
      {/* Left Section */}
      <div className="w-full sm:w-1/2 flex flex-col justify-center items-start px-8 sm:px-12 py-10 text-[#2f2f2f]">
        <div className="flex items-center gap-2 mb-3">
          <p className="w-10 h-[2px] bg-[#2f2f2f]"></p>
          <p className="font-medium text-sm md:text-base tracking-wide">
            HÀNG BÁN CHẠY NHẤT
          </p>
        </div>

        <h1 className="main-font text-4xl sm:text-5xl lg:text-6xl font-bold text-amber-900 leading-tight mb-4">
          Hàng Mới Về <br />
          <span className="text-amber-700">Đậm Hương Vị – Đầy Cảm Xúc</span>
        </h1>

        <p className="text-gray-700 text-sm sm:text-base mb-6 max-w-md">
          Khám phá những sản phẩm cà phê mới nhất của{" "}
          <span className="font-semibold text-amber-800">Velvet Roast</span>,
          nơi hương vị đậm đà và tinh tế hội tụ trong từng tách cà phê.
        </p>

        <Link
          to="/shop"
          className="bg-amber-700 text-white font-medium px-6 py-3  hover:bg-amber-800 transition-colors duration-300"
        >
          Mua Ngay
        </Link>
      </div>

      {/* Right Section */}
      <div className="w-full sm:w-1/2 h-full">
        <img
          src={assets.hero_img}
          alt="Velvet Roast Hero"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  );
};

export default Hero;
