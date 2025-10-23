import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

const ListCategory = ({ token }) => {
  const API_get = backendUrl + "/api/category/get";
  const API_delete = backendUrl + "/api/category/delete";
  const API_edit = backendUrl + "/api/category/get";
  // console.log(API);
  const [list, setList] = useState([]);
  const fetchList = async () => {
    try {
      const response = await axios.get(API_get);
      if (response.data.success) {
        setList(response.data.category);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeCategory = async (id) => {
    try {
      const response = await axios.delete(API_delete, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id }, // `data` must be nested under config for DELETE
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const editCategory = async (id) => {
    try {
      const response = await axios.delete(API_delete, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id }, // `data` must be nested under config for DELETE
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div>
      <>
        <p className="mb-2">CATEGORY LIST</p>
        <div className="flex flex-col gap-2 w-full border rounded-lg overflow-hidden">
          {/* List table */}
          <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center bg-gray-100 text-gray-800 font-semibold rounded-lg px-4 py-2 shadow-sm">
            <span>Image</span>
            <span>Name</span>
            <span>Description</span>
            <span className="text-center">Action</span>
          </div>

          {/* Items */}
          {list.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[100px_2fr_1fr_1fr_150px] items-center"
            >
              <div className="border-r border-b border-gray-400 flex justify-center p-2">
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded"
                />
              </div>
              <div className="border-r border-b border-gray-400 p-2">
                {item.name}
              </div>

              <div className="border-r border-b border-gray-400 p-2">
                {item.description}
              </div>

              <div className="border-b border-gray-400 flex justify-center gap-2 p-2">
                <button
                  onClick={() => editCategory(item._id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeCategory(item._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    </div>
  );
};

export default ListCategory;
