import React from "react";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      {/* Left */}
      <div className="w-full sm:2-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">
              HÀNG BÁN CHẠY NHẤT
            </p>
          </div>
          <h1 className="text-3x1 sm:py-3 lg:text-5x1 leading-relaxed">
            Hàng mới về
          </h1>

          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">shop now</p>
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
          </div>
        </div>
      </div>
      {/* Right */}
      <img className="w-full sm:w-1/2" src={assets.hero_img} alt="" />
    </div>
  );
};

export default Hero;
