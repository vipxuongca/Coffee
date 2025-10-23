import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2 border-[#a1887f] bg-[#f8f3ef] shadow-inner">
      <div className="flex flex-col gap-4 pt-8 pl-[15%] text-[15px] font-serif text-[#3e2723]">
        <h2 className="text-lg font-bold mb-4 tracking-wide text-[#4e342e]">
          Dashboard
        </h2>

        <NavLink
          className="flex items-center gap-3 border border-[#d7ccc8] bg-[#ffd4b3] hover:bg-[#efebe9] transition-all duration-300 border-r-0 px-3 py-2 rounded-md shadow-sm hover:shadow-md"
          to="/list"
        >
          <img className="w-5 h-5 opacity-80" src={assets.order_icon} alt="" />
          <p className="hidden md:block">All Products</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-[#d7ccc8] bg-[#ffd4b3] hover:bg-[#efebe9] transition-all duration-300 border-r-0 px-3 py-2 rounded-md shadow-sm hover:shadow-md"
          to="/add"
        >
          <img className="w-5 h-5 opacity-80" src={assets.add_icon} alt="" />
          <p className="hidden md:block">Add Product</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-[#d7ccc8] bg-[#ffd4b3] hover:bg-[#efebe9] transition-all duration-300 border-r-0 px-3 py-2 rounded-md shadow-sm hover:shadow-md"
          to="/list-category"
        >
          <img className="w-5 h-5 opacity-80" src={assets.order_icon} alt="" />
          <p className="hidden md:block">All Categories</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-[#d7ccc8] bg-[#ffd4b3] hover:bg-[#efebe9] transition-all duration-300 border-r-0 px-3 py-2 rounded-md shadow-sm hover:shadow-md"
          to="/add-category"
        >
          <img className="w-5 h-5 opacity-80" src={assets.add_icon} alt="" />
          <p className="hidden md:block">Add Categories</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-[#d7ccc8] bg-[#ffd4b3] hover:bg-[#efebe9] transition-all duration-300 border-r-0 px-3 py-2 rounded-md shadow-sm hover:shadow-md"
          to="/orders"
        >
          <img className="w-5 h-5 opacity-80" src={assets.order_icon} alt="" />
          <p className="hidden md:block">Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
