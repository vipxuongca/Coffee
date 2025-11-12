import { useContext } from "react";
import { ShopContext } from "../../context/ShopContext";
import { assets } from "../../assets/assets";

const SearchBar = () => {
  const { search, setSearch } = useContext(ShopContext);

  // console.log(location);

  return (
    <div className="border-t bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-3 py-1.5 my-3 mx-2 rounded-full w-2/3 sm:w-1/3">
        <input
          className="flex-1 outline-none bg-inherit text-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
        />
        <img src={assets.search_icon} alt="" className="w-4 h-4 ml-1" />
      </div>
    </div>
  );
};

export default SearchBar;
