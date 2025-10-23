import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const Edit = ({ token }) => {
  const { id } = useParams();

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

        // Set primitive fields
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

        // Set images safely
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
          const categories = response.data.category || []; // adjust key if needed
          setCategoryList(categories);
          if (categories.length > 0) {
            setCategory(categories[0].name); // default to first item
          }
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div>
      <h1>EDIT PRODUCT</h1>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col w-full items-start gap-3"
      >
        <div>
          <p className="mb-2">Upload Image</p>

          <div className="flex gap-2">
            <label htmlFor="image1">
              <img
                className="w-20"
                src={
                  !image1
                    ? assets.upload_area
                    : typeof image1 === "string"
                    ? image1
                    : URL.createObjectURL(image1)
                }
                alt=""
              />
              <input
                onChange={(e) => setImage1(e.target.files[0])}
                type="file"
                id="image1"
                hidden
              />
            </label>

            <label htmlFor="image2">
              <img
                className="w-20"
                src={
                  !image2
                    ? assets.upload_area
                    : typeof image2 === "string"
                    ? image2
                    : URL.createObjectURL(image2)
                }
                alt=""
              />
              <input
                onChange={(e) => setImage2(e.target.files[0])}
                type="file"
                id="image2"
                hidden
              />
            </label>

            <label htmlFor="image3">
              <img
                className="w-20"
                src={
                  !image3
                    ? assets.upload_area
                    : typeof image3 === "string"
                    ? image3
                    : URL.createObjectURL(image3)
                }
                alt=""
              />
              <input
                onChange={(e) => setImage3(e.target.files[0])}
                type="file"
                id="image3"
                hidden
              />
            </label>

            <label htmlFor="image4">
              <img
                className="w-20"
                src={
                  !image4
                    ? assets.upload_area
                    : typeof image4 === "string"
                    ? image4
                    : URL.createObjectURL(image4)
                }
                alt=""
              />
              <input
                onChange={(e) => setImage4(e.target.files[0])}
                type="file"
                id="image4"
                hidden
              />
            </label>
          </div>
        </div>

        <div className="w-full">
          <p className="mb-2">Product Name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full max-w-[500px] px-3 py-2"
            type="text"
            placeholder="Product Name"
          />
        </div>
        <div className="w-full">
          <p className="mb-2">Brand</p>
          <input
            onChange={(e) => setBrand(e.target.value)}
            value={brand}
            className="w-full max-w-[500px] px-3 py-2"
            type="text"
            placeholder="Brand"
          />
        </div>
        <div className="w-full">
          <p className="mb-2">Product Description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full max-w-[500px] px-3 py-2"
            type="text"
            placeholder="Product Description"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
          <div>
            <p className="mb-2">Category</p>
            <select
              className="w-full px-3 py-2"
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

          <div>
            <p className="mb-2"> SubCategory</p>
            <select
              className="w-full px-3 py-2"
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
            >
              {categoryList.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <p className="mb-2">Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="0"
          />
        </div>

        <div>
          <p className="mb-2">Discount</p>
          <input
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="0"
          />
        </div>
        <div>
          <p className="mb-2">Stock</p>
          <input
            onChange={(e) => setStock(e.target.value)}
            value={stock}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="0"
          />
        </div>

        <div>
          <p className="mb-2">Variants</p>
          <div className="flex gap-3">
            <p className="bg-slate-200 px-3 py-1 cursor-pointer">?</p>
            <p className="bg-slate-200 px-3 py-1 cursor-pointer">?</p>
            <p className="bg-slate-200 px-3 py-1 cursor-pointer">?</p>
            <p className="bg-slate-200 px-3 py-1 cursor-pointer">?</p>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <input
            type="checkbox"
            id="bestseller"
            onChange={(e) => setBestseller(e.target.checked)}
            value={bestseller}
          />
          <label className="cursor-pointer" htmlFor="bestseller">
            Best seller toggle
          </label>
        </div>

        <button
          type="submit"
          className="w-28 py-3 mt-4 bg-[#3e2723] text-white"
        >
          EDIT
        </button>
      </form>
    </div>
  );
};

export default Edit;
