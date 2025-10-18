import React from "react";
import { assets } from "../assets/assets";

const Policy = () => {
  return (
    <div className="flec flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
      <div>
        <img src={assets.exchange_icon} className="w-12 m-auto mb-5" alt="" />
        <p className="font-semibold">Chinh sach doi tra</p>
        <p className="text-gray-400">Doi tra de dang</p>
      </div>

      <div>
        <img src={assets.quality_icon} className="w-12 m-auto mb-5" alt="" />
        <p className="font-semibold">Chinh sach doi tra</p>
        <p className="text-gray-400">Doi tra de dang</p>
      </div>

      <div>
        <img src={assets.support_icon} className="w-12 m-auto mb-5" alt="" />
        <p className="font-semibold">Chinh sach doi tra</p>
        <p className="text-gray-400">Doi tra de dang</p>
      </div>

      <div>
        <img src={assets.exchange_icon} className="w-12 m-auto mb-5" alt="" />
        <p className="font-semibold">Chinh sach doi tra</p>
        <p className="text-gray-400">Doi tra de dang</p>
      </div>
    </div>
  );
};

export default Policy;
