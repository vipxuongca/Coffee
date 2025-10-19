import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt40 text-sm">
      <div>
        <img src={assets.logo} className="mb-5 w-32" alt="" />
        <p className="w-full md:w-2/3 text-gray-600">fdafdsafdsa</p>
      </div>

      <div>
        <p className="text-xl font-medium mb-5">Coffee</p>
        <ul className="flex flex-col gap-1 text-gray-600">
          <li>Home</li>
          <li>About</li>
          <li>Delivey</li>
          <li>Privacy</li>
        </ul>
      </div>

      <div>
        <p className="text-xl font-medium mb-5">Contact us</p>
        <ul className="flex flex-col gap-1 text-gray-600">
          <li> +8491324325321532</li>
          <li>coffee@gmail.com</li>
        </ul>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2025 All right reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
