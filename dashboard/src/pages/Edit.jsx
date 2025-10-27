import React, { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";

const Edit = () => {
  const { id } = useParams();
  const { token, setLoading } = useContext(AdminContext);
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("100000");
  const [discount, setDiscount] = useState("0");
  const [stock, setStock] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [variants, setVariants] = useState([]);
  const [brand, setBrand] = useState("");

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/fetch/${id}`);
      if (response.data.success) {
        const product = response.data.product;

        setName(product.name || "");
        setDescription(product.description || "");
        setPrice(product.price || "");
        setDiscount(product.discount || "");
        setStock(product.stock || "");
        setCategory(product.category || "");
        setSubCategory(product.subCategory || "");
        setBestseller(product.bestseller || false);
        setBrand(product.brand || "");
        setVariants(product.variant || []);

        if (Array.isArray(product.image)) {
          setImage1(product.image[0] || false);
          setImage2(product.image[1] || false);
          setImage3(product.image[2] || false);
          setImage4(product.image[3] || false);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/category/get`);
        if (response.data.success) {
          const categories = response.data.category || [];
          setCategoryList(categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", Number(price));
      formData.append("discount", Number(discount));
      formData.append("stock", Number(stock));
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("variants", JSON.stringify(variants));
      formData.append("bestseller", bestseller);
      formData.append("brand", brand);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.put(
        backendUrl + "/api/product/edit/" + id,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 mt-6">
      <h1 className="text-2xl font-semibold mb-6 text-[#3e2723]">
        Chỉnh Sửa Sản Phẩm<menu type="toolbar"></menu>
      </h1>

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col w-full items-start gap-5"
      >
        {/* Upload Image */}
        <div className="w-full">
          <p className="mb-2 font-medium">Tải Lên Hình Ảnh</p>
          <div className="flex gap-3 flex-wrap">
            {[image1, image2, image3, image4].map((img, i) => (
              <label key={i} htmlFor={`image${i + 1}`}>
                <img
                  className="w-24 h-24 object-cover rounded-md border border-gray-300 cursor-pointer hover:opacity-80"
                  src={
                    !img
                      ? assets.upload_area
                      : typeof img === "string"
                      ? img
                      : URL.createObjectURL(img)
                  }
                  alt=""
                />
                <input
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (i === 0) setImage1(file);
                    if (i === 1) setImage2(file);
                    if (i === 2) setImage3(file);
                    if (i === 3) setImage4(file);
                  }}
                  type="file"
                  id={`image${i + 1}`}
                  hidden
                />
              </label>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full">
          <p className="mb-1 font-medium">Tên Sản Phẩm</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full border rounded-md px-3 py-2"
            type="text"
            placeholder="Product Name"
          />
        </div>

        <div className="w-full">
          <p className="mb-1 font-medium">Thương Hiệu</p>
          <input
            onChange={(e) => setBrand(e.target.value)}
            value={brand}
            className="w-full border rounded-md px-3 py-2"
            type="text"
            placeholder="Brand"
          />
        </div>

        <div className="w-full">
          <p className="mb-1 font-medium">Mô Tả</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full border rounded-md px-3 py-2 h-24"
            placeholder="Product Description"
          />
        </div>

        {/* Category & Subcategory */}
        <div className="flex flex-col sm:flex-row gap-5 w-full">
          <div className="flex-1">
            <p className="mb-1 font-medium">Phân Loại</p>
            <select
              className="w-full border rounded-md px-3 py-2"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              {categoryList.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* <div className="flex-1">
            <p className="mb-1 font-medium">Subcategory</p>
            <select
              className="w-full border rounded-md px-3 py-2"
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
            >
              {categoryList.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div> */}
        </div>

        {/* Price, Discount, Stock */}
        <div className="flex flex-col sm:flex-row gap-5 w-full">
          <div className="flex-1">
            <p className="mb-1 font-medium">Giá</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full border rounded-md px-3 py-2"
              type="number"
              placeholder="0"
            />
          </div>

          <div className="flex-1">
            <p className="mb-1 font-medium">Giảm Giá</p>
            <input
              onChange={(e) => setDiscount(e.target.value)}
              value={discount}
              className="w-full border rounded-md px-3 py-2"
              type="number"
              placeholder="0"
            />
          </div>

          <div className="flex-1">
            <p className="mb-1 font-medium">Tồn Kho</p>
            <input
              onChange={(e) => setStock(e.target.value)}
              value={stock}
              className="w-full border rounded-md px-3 py-2"
              type="number"
              placeholder="0"
            />
          </div>
        </div>

        {/* Variants */}
        {/* <div className="w-full">
          <p className="mb-2 font-medium">Variants</p>
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <p
                key={i}
                className="bg-slate-200 px-3 py-1 rounded cursor-pointer select-none"
              >
                ?
              </p>
            ))}
          </div>
        </div> */}

        {/* Bestseller */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="bestseller"
            onChange={(e) => setBestseller(e.target.checked)}
            checked={bestseller}
          />
          <label className="cursor-pointer" htmlFor="bestseller">
            Hàng Bán Chạy
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-32 py-3 mt-4 bg-[#3e2723] text-white rounded-md hover:bg-[#4e342e] transition"
        >
          CHỈNH SỬA
        </button>
      </form>
    </div>
  );
};

export default Edit;
