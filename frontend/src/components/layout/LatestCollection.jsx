import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import Title from "./Title";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1="Sản phẩm " text2="Mới nhất" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-700">
          Cà phê ngon nhất thế giới — rang xay thủ công, hương vị đậm đà và tinh
          tế.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid justify-center grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
        {latestProducts.map((item) => (
          <Link
            key={item._id}
            to={`/product/${item._id}`}
            className="flex justify-center"
          >
            <ProductCard product={item} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
