import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="bg-[#3e2723] text-white font-serif mt-20">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 px-6 md:px-20 py-12 text-sm">
        {/* Logo and description */}
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="Coffee Shop Logo" />
          <p className="w-full md:w-2/3 text-amber-100 leading-relaxed">
            At <span className="font-semibold">Velvet Roast</span>, we believe every cup tells a story.
            From the beans we roast to the smiles we serve, our mission is to
            craft warmth, flavor, and community in every pour.
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="text-xl font-semibold mb-5 text-amber-300">Coffee</p>
          <ul className="flex flex-col gap-1 text-amber-100">
            <li className="hover:text-amber-300 cursor-pointer">Home</li>
            <li className="hover:text-amber-300 cursor-pointer">About</li>
            <li className="hover:text-amber-300 cursor-pointer">Delivery</li>
            <li className="hover:text-amber-300 cursor-pointer">Privacy</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xl font-semibold mb-5 text-amber-300">
            Contact Us
          </p>
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
