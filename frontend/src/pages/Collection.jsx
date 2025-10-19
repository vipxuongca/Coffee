import React, { useContext, useState } from "react";
import { ShopContext } from "../context/shopContext";

const Collection = () => {
  const { products } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filtering */}
      <div className="min-w-60">
        <p
          className="my-2 text-x1 flex items-center cursor-pointer gap-2"
          onClick={() => setShowFilter(!showFilter)}
        >
          Filter
        </p>
        <div
          className={`border-gray-300 border pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        ></div>
      </div>
    </div>
  );
};

export default Collection;
