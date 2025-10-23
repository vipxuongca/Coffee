import React from "react";
import { assets } from "../assets/assets";
import { NavLink, Link } from "react-router-dom";

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between bg-[#3e2723]">
      <img className="w-[max(10%, 80px)]" src={assets.logo} alt="" />
      <button
        // set the token back to empty string, when log out
        onClick={() => setToken('')} 
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
