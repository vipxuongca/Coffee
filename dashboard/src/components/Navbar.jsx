import { assets } from "../assets/assets";
import { NavLink, Link } from "react-router-dom";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";

const Navbar = () => {
  const { setToken } = useContext(AdminContext);
  return (
    <div className="flex items-center justify-between bg-[#3e2723] py-2 px-4 sticky top-0 z-50">
      <img
        className="w-60 sm:w-60 object-contain ml-0"
        src={assets.logo}
        alt="Logo"
      />
      <button
        onClick={() => setToken("")}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        Đăng Xuất
      </button>
    </div>
  );
};

export default Navbar;
