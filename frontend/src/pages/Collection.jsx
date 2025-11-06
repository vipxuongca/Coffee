import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";

const Collection = () => {
  const { categories, products, search } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setcategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setcategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setcategory((prev) => [...prev, e.target.value]);
    }
  };

  // const toggleSubCategory = (e) => {
  //   if (subCategory.includes(e.target.value)) {
  //     setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
  //   } else {
  //     setSubCategory((prev) => [...prev, e.target.value]);
  //   }
  // };

  const applyFilters = () => {
    let productsCopy = products.slice();

    if (search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProducts = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilters();
        break;
    }
  };

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  useEffect(() => {
    applyFilters();
  }, [category, subCategory, search, products]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filtering */}
      <div className="min-w-60">
        <p
          className="my-2 text-x1 flex items-center cursor-pointer gap-2"
          onClick={() => setShowFilter(!showFilter)}
        >
          FILTER
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        <div
          className={`border-gray-300 border pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">PHÂN LOẠI</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {categories.map((cat) => (
              <p key={cat._id}>
                <input
                  className="w-3"
                  type="checkbox"
                  value={cat.name}
                  onChange={toggleCategory}
                />{" "}
                {cat.name}
              </p>
            ))}
          </div>

          {/* Subcategory filter */}
          {/* <p className="mb-3 mt-6 text-sm font-medium">KIỂU LOẠI</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Roasted"
                onChange={toggleSubCategory}
              />{" "}
              Roasted
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Raw"
                onChange={toggleSubCategory}
              />{" "}
              Raw
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Ground"
                onChange={toggleSubCategory}
              />{" "}
              Ground
            </p>
          </div> */}
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1">
        {/* Product Grid */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex justify-between items-center text-base sm:text-2xl mb-6">
            <Title text1="TẤT CẢ " text2="SẢN PHẨM" />
            <select
              className="border border-gray-300 rounded-md text-sm px-3 py-2 bg-white shadow-sm hover:border-gray-400 focus:outline-none"
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="relevant">Tất cả</option>
              <option value="low-high">Giá: Thấp - Cao</option>
              <option value="high-low">Giá: Cao - Thấp</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterProducts.map((item, index) => (
              <a
                key={index}
                href={`/product/${item._id}`}
                className="group block border border-gray-200 rounded-2xl shadow-md bg-white overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-lg"
              >
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-110"
                />
                <div className="p-4">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">
                    {item.description || " "}
                  </p>
                  <p className="text-amber-700 font-semibold mt-2 text-sm md:text-base">
                    {item.price.toLocaleString()}₫
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
