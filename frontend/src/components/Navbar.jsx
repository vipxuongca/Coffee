import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { CartContext } from "../context/CartContext";
import { FiShoppingCart, FiUser } from "react-icons/fi";

const Navbar = () => {
  const baseClass = "flex flex-col items-center gap-1 group";
  const [visible, setVisible] = useState(false);
  const { token } = useContext(ShopContext);
  const { cartCountTotal } = useContext(CartContext);

  return (
    <div className="flex items-center justify-between py-3 px-4 md:px-8 sticky top-0 z-50 bg-[#3e2723] text-white shadow-lg">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="w-28 h-auto" />
      </Link>

      <div className="flex flex-col items-center">
        <img
          src={assets.company}
          alt="Company Name"
          className="md:h-12 mb-3 object-contain"
        />
        <ul className="hidden sm:flex gap-6 text-base">
          {[
            { name: "TRANG CHỦ", path: "/" },
            { name: "CỬA HÀNG", path: "/shop" },
            { name: "GIỚI THIỆU", path: "/about" },
            { name: "LIÊN HỆ", path: "/contact" },
          ].map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `${baseClass} ${
                  isActive ? "active" : ""
                } hover:text-amber-200 transition-colors`
              }
            >
              <p>{item.name}</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-amber-400 invisible group-[.active]:visible group-hover:visible transition-all" />
            </NavLink>
          ))}
        </ul>
      </div>

      {/* LOG IN */}
      <div className="flex items-center gap-6">
        {/* Profile top-right */}
        <Link to={!token ? "/login" : "/user"}>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border">
            <span>{!token ? "Đăng nhập/Đăng ký" : "Xin chào"}</span>
            <FiUser className="w-5 h-5" />
          </button>
        </Link>

        {/* CART */}
        <Link to={!token ? "/login" : "/cart"} className="relative">
          <button className="relative flex items-center justify-center p-2 rounded-full border">
            <FiShoppingCart className="w-6 h-6" />
            {token && cartCountTotal > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-amber-600 text-white text-[10px] rounded-full font-semibold">
                {cartCountTotal}
              </span>
            )}
          </button>
        </Link>

        {/* Mobile Menu */}
        <button
          onClick={() => setVisible(true)}
          className="w-6 cursor-pointer sm:hidden invert brightness-0 saturate-0"
        >
          <img src={assets.menu_icon} alt="menu" />
        </button>
      </div>

      {/* Sidebar mobile */}
      <div
        className={`fixed sm:hidden top-0 right-0 bottom-0 overflow-hidden bg-[#4e342e] text-white transition-all z-50 ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-4 cursor-pointer"
          >
            <img
              src={assets.dropdown_icon}
              className="h-4 rotate-180 invert brightness-0 saturate-0"
              alt="back"
            />
            <p>Back</p>
          </div>

          {[
            { name: "TRANG CHỦ", path: "/" },
            { name: "CỬA HÀNG", path: "/shop" },
            { name: "GIỚI THIỆU", path: "/about" },
            { name: "LIÊN HỆ", path: "/contact" },
          ].map((item) => (
            <NavLink
              key={item.name}
              onClick={() => setVisible(false)}
              className="py-3 pl-6 border-b border-stone-600 hover:bg-[#5d4037] transition-colors"
              to={item.path}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
