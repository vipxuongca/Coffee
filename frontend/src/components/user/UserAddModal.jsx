import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { ShopContext } from "../../context/ShopContext";

const UserAddModal = ({ showAddModal, setShowAddModal }) => {
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
      setShowAddModal(false);
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

  // ✅ Must return JSX
  if (!showAddModal) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={() => setShowAddModal(false)}
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
              onClick={() => setShowAddModal(false)}
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

export default UserAddModal;
