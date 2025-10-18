import React, { use, useCallback } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/shopContext";
import { useContext } from "react";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return <Link className= 'text-gray-700 cursor-pointer'to={`/product/${id}`}>
    <div className="overflow-hidden">
      <img className="hover:scale-110 transition ease-in-out" src={image[0]} alt="" />
    </div>
    <p className="pt-3 pb-1 text-sm">{name}</p>
    <p className="text-sm font-medium">{price.toLocaleString()} {currency}</p>
  </Link>;
};

export default ProductItem;
