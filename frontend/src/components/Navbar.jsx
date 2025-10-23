import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const baseClass = "flex flex-col items-center gap-1 group";
  const [visible, setVisible] = useState(false);
  const { setShowSearch } = useContext(ShopContext);
  const { cartCount } = useContext(ShopContext);

  return (
    <div className="flex items-center justify-between py-3 px-4 md:px-8 font-serif sticky top-0 z-50 bg-[#3e2723] text-white shadow-lg">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="w-24 h-auto" />
      </Link>

      {/* Desktop Navigation */}
      <div className="flex flex-col items-center">
        {/* Company name image */}
        <img
          src={assets.company}
          alt="Company Name"
          className="md:h-12 mb-3 object-contain"
        />

        {/* Navigation buttons */}
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

      {/* Icons */}
      <div className="flex items-center gap-6">
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className="w-5 cursor-pointer invert brightness-0 saturate-0"
          alt="search"
        />

        {/* Profile Dropdown */}
        <div className="group relative">
          <img
            src={assets.profile_icon}
            className="w-5 invert brightness-0 saturate-0"
            alt="profile"
          />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-1 w-36 py-2 px-2 bg-white text-stone-700 rounded-md shadow-lg border border-stone-200">
              <p className="cursor-pointer hover:text-black hover:bg-stone-100 rounded px-3 py-1">
                Profile
              </p>
              <p className="cursor-pointer hover:text-black hover:bg-stone-100 rounded px-3 py-1">
                Orders
              </p>
              <p className="cursor-pointer hover:text-black hover:bg-stone-100 rounded px-3 py-1">
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Cart Icon */}
        <Link to="/cart" className="relative">
          <img
            src={assets.cart_icon}
            className="w-5 min-w-5 invert brightness-0 saturate-0"
            alt="cart"
          />
          {cartCount > 0 && (
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-amber-600 text-white aspect-square rounded-full text-[8px]">
              {cartCount}
            </p>
          )}
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden invert brightness-0 saturate-0"
          alt="menu"
        />
      </div>

      {/* Sidebar menu for small screens */}
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
              alt=""
            />
            <p>Back</p>
          </div>

          {[
            { name: "HOME", path: "/" },
            { name: "COLLECTION", path: "/collection" },
            { name: "ABOUT", path: "/about" },
            { name: "CONTACT", path: "/contact" },
            { name: "PRODUCT", path: "/product" },
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
