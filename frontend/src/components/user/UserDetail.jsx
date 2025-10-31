import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../../context/ShopContext";

const UserDetail = ({ userDetail }) => {
  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    receiverName: "",
    phone: "",
    addressLine1: "",
    ward: "",
    city: "",
    isDefault: false,
  });

  const { setLoading } = useContext(ShopContext);

  const handleChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:4010/api/user-detail/add`,
        { ...newAddress },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.data.success) throw new Error("Failed to add address");
      toast.success("Đã thêm địa chỉ mới");
      setShowModal(false);
      setNewAddress({
        receiverName: "",
        phone: "",
        addressLine1: "",
        ward: "",
        city: "",
        isDefault: false,
      });
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi thêm địa chỉ mới.");
    } finally {
      setLoading(false);
    }
  };

  // Placeholder handlers for edit/delete
  const handleEdit = (id) => {
    toast.info(`Sửa địa chỉ: ${id}`);
  };

  const handleDelete = async (id) => {
    toast.warn(`Xóa địa chỉ: ${id}`);
  };

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title">Thông Tin Người Nhận</h2>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowModal(true)}
          >
            + Thêm Địa Chỉ
          </button>
        </div>

        {userDetail?.data?.length > 0 ? (
          <div className="mt-4 space-y-4">
            {[...userDetail.data]
              .sort((a, b) => (b.isDefault === true) - (a.isDefault === true))
              .map((item) => (
                <div
                  key={item._id}
                  className="p-4 border rounded-lg shadow-sm bg-base-200 flex justify-between items-start"
                >
                  <div>
                    <p>
                      <strong>Người nhận:</strong> {item.receiverName}
                    </p>
                    <p>
                      <strong>SĐT:</strong> {item.phone}
                    </p>
                    <p>
                      <strong>Địa chỉ:</strong> {item.addressLine1}
                    </p>
                    <p>
                      <strong>Phường/Xã:</strong> {item.ward}
                    </p>
                    <p>
                      <strong>Tỉnh/Thành Phố:</strong> {item.city}
                    </p>
                    {item.isDefault && (
                      <span className="text-green-600 text-lg font-semibold">
                        ✔ Mặc định
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-2 ml-3">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Sửa"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Xóa"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="mt-4">Không tìm thấy Địa chỉ nào</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md border border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Thêm Địa Chỉ Mới</h3>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tên người nhận <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="receiverName"
                  value={newAddress.receiverName}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={newAddress.phone}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Địa chỉ cụ thể <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={newAddress.addressLine1}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phường/Xã <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ward"
                  value={newAddress.ward}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Thành phố <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={newAddress.isDefault || false}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      isDefault: e.target.checked,
                    })
                  }
                  className="checkbox checkbox-sm"
                />
                <label className="text-sm">Đặt làm địa chỉ mặc định</label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="btn px-5 bg-gray-200 hover:bg-gray-300 text-gray-800"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn px-5 bg-[#3e2723] hover:bg-[#5d4037] text-white border-none"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
