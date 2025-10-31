import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ShopContext } from "../../context/ShopContext";

const UserEditModal = ({ showEditModal, setShowEditModal, detail }) => {
  const { setLoading } = useContext(ShopContext);
  const [newAddress, setNewAddress] = useState({
    receiverName: "",
    phone: "",
    addressLine1: "",
    ward: "",
    city: "",
    isDefault: false,
  });

  // ✅ Populate fields when modal opens or `detail` changes
  useEffect(() => {
    if (detail) {
      setNewAddress({
        receiverName: detail.receiverName || "",
        phone: detail.phone || "",
        addressLine1: detail.addressLine1 || "",
        ward: detail.ward || "",
        city: detail.city || "",
        isDefault: detail.isDefault || false,
      });
    }
  }, [detail]);

  const handleChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:4010/api/user-detail/edit`,
        { id: detail._id, ...newAddress }, // ✅ include id for editing
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.data.success) throw new Error("Chỉnh sửa không thành công");
      toast.success("Đã chỉnh sửa địa chỉ");
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi chỉnh sửa địa chỉ.");
    } finally {
      setLoading(false);
    }
  };

  if (!showEditModal) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={() => setShowEditModal(false)}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md border border-gray-300"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-4">Chỉnh sửa địa chỉ</h3>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="receiverName"
            value={newAddress.receiverName}
            onChange={handleChange}
            placeholder="Tên người nhận"
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="phone"
            value={newAddress.phone}
            onChange={handleChange}
            placeholder="Số điện thoại"
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="addressLine1"
            value={newAddress.addressLine1}
            onChange={handleChange}
            placeholder="Địa chỉ cụ thể"
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="ward"
            value={newAddress.ward}
            onChange={handleChange}
            placeholder="Phường/Xã"
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="city"
            value={newAddress.city}
            onChange={handleChange}
            placeholder="Thành phố"
            className="input input-bordered w-full"
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              name="isDefault"
              checked={newAddress.isDefault}
              onChange={(e) =>
                setNewAddress({ ...newAddress, isDefault: e.target.checked })
              }
              className="checkbox checkbox-sm"
            />
            <label className="text-sm">Đặt làm địa chỉ mặc định</label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="btn px-5 bg-gray-200 hover:bg-gray-300 text-gray-800"
              onClick={() => setShowEditModal(false)}
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
  );
};

export default UserEditModal;
