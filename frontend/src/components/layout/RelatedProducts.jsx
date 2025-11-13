import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import Title from "./Title";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";

const RelatedProducts = ({ category }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0 && category) {
      let filtered = products.filter((item) => item.category === category);
      setRelated(filtered.slice(0, 5));
    }
  }, [products, category]);

  return (
    <div
      className="grid gap-4 sm:gap-5 
  grid-cols-[repeat(auto-fill,minmax(12rem,max-content))] 
  justify-center"
    >
      {related.map((item) => (
        <Link key={item._id} to={`/product/${item._id}`}>
          <div className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group cursor-pointer">
            <ProductCard product={item} />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RelatedProducts;
