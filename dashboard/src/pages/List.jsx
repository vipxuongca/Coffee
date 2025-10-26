import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const List = ({ token }) => {
  const navigate = useNavigate();
  const API_get = backendUrl + "/api/product/get";
  const API_delete = backendUrl + "/api/product/delete";

  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(API_get);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.delete(API_delete, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const editProduct = (id) => {
    navigate(`/edit/${id}`);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="p-4">
      <p className="mb-4 text-lg font-semibold">Danh Mục Sản Phẩm</p>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        {/* Header */}
        <div className="grid grid-cols-[100px_2fr_1fr_1fr_1fr_150px] bg-gray-100 text-gray-800 font-semibold py-2 px-4 border-b">
          <span>Hình Ảnh</span>
          <span>Tên SP</span>
          <span>Phân Loại</span>
          <span>Giá</span>
          <span>Tồn Kho</span>
          <span className="text-center">Thao Tác</span>
        </div>

        {/* Rows */}
        {list.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[100px_2fr_1fr_1fr_1fr_150px] items-center px-4 py-2 border-b hover:bg-gray-50 transition"
          >
            <div className="flex justify-center">
              <img
                src={item.image[0]}
                alt={item.name}
                className="w-14 h-14 object-cover rounded"
              />
            </div>
            <div>{item.name}</div>
            <div>{item.category}</div>
            <div className="text-center">
              {item.price.toLocaleString()} {currency}
            </div>
            <div className="text-center">{item.stock}</div>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => editProduct(item._id)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Sửa
              </button>
              <button
                onClick={() => removeProduct(item._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <p className="text-center text-gray-500 py-6">Không tìm thấy sản phẩm nào</p>
        )}
      </div>
    </div>
  );
};

export default List;
