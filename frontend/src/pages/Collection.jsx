import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/layout/Title";
import HighlightBox from "../components/ad/HighlightBox";
import ProductCard from "../components/ProductCard";

const Collection = () => {
  const { categories, products, search } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setcategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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

    // Price filter
    if (minPrice !== "") {
      productsCopy = productsCopy.filter(
        (item) => item.price >= Number(minPrice)
      );
    }
    if (maxPrice !== "") {
      productsCopy = productsCopy.filter(
        (item) => item.price <= Number(maxPrice)
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

  const handleMin = (e) => {
    const v = e.target.value.replace(/\D/g, ""); // remove non-digits
    setMinPrice(v ? parseInt(v, 10) * 1000 : "");
  };

  const handleMax = (e) => {
    const v = e.target.value.replace(/\D/g, "");
    setMaxPrice(v ? parseInt(v, 10) * 1000 : "");
  };

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  useEffect(() => {
    applyFilters();
  }, [category, subCategory, search, products, minPrice, maxPrice]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filtering */}
      <div className="min-w-60 max-w-60">
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
        </div>

        <div
          className={`border-gray-300 border pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">KHOẢNG GIÁ (nghìn đồng)</p>
          <input
            type="text"
            placeholder="từ"
            value={minPrice ? minPrice / 1000 : ""}
            onChange={handleMin}
            className="no-arrow w-20 border border-gray-300 rounded px-2 py-1"
          />
          <span>-</span>
          <input
            type="text"
            placeholder="đến"
            value={maxPrice ? maxPrice / 1000 : ""}
            onChange={handleMax}
            className="no-arrow w-20 border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <HighlightBox />
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
                className="group block border border-gray-200 rounded-none shadow-md bg-white overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-lg"
              >
                <ProductCard product={item} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
