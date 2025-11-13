import React from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-[#3e2723] text-white mt-20">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 px-6 md:px-20 py-12 text-sm">
        {/* Logo and description */}
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="Coffee Shop Logo" />
          <p className="w-full md:w-2/3 text-amber-100 leading-relaxed">
            Tại <span className="font-semibold">Velvet Roast</span>, chúng tôi
            tin rằng mỗi tách cà phê đều kể một câu chuyện. Từ những hạt cà phê
            được rang cho đến nụ cười được trao đi, sứ mệnh của chúng tôi là
            mang lại sự ấm áp, hương vị và kết nối trong từng giọt cà phê.
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="text-xl font-semibold mb-5 text-amber-300">
            Velvet Roast
          </p>
          <ul className="flex flex-col gap-1 text-amber-100">
            <li className="hover:text-amber-300 cursor-pointer">
              <Link to="/">Trang chủ</Link>
            </li>
            <li className="hover:text-amber-300 cursor-pointer">
              <Link to="/about">Giới thiệu</Link>
            </li>
            <li className="hover:text-amber-300 cursor-pointer">
              <Link to="/delivery">Giao hàng</Link>
            </li>
            <li className="hover:text-amber-300 cursor-pointer">
              <Link to="/privacy">Quyền riêng tư</Link>
            </li>
            <li className="hover:text-amber-300 cursor-pointer">
              <Link to="/policy">Chính sách mua hàng</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xl font-semibold mb-5 text-amber-300">Liên Hệ</p>
          <ul className="flex flex-col gap-1 text-amber-100">
            <li>+84 913 243 253</li>
            <li>coffee@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-amber-700 text-center py-5 text-amber-200 text-sm">
        © 2025 Velvet Roast. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
