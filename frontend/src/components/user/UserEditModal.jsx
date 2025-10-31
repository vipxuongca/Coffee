import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ShopContext } from "../../context/ShopContext";

const UserEditModal = ({
  showEditModal,
  setShowEditModal,
  setUserDetail,
  setReload,
  editDetail,
}) => {
  const { setLoading } = useContext(ShopContext);

  const [newAddress, setNewAddress] = useState({
    receiverName: "",
    phone: "",
    addressLine1: "",
    ward: "",
    city: "",
    isDefault: false,
  });

  // ✅ Populate modal fields when editDetail changes
  useEffect(() => {
    if (editDetail) {
      setNewAddress({
        receiverName: editDetail.receiverName || "",
        phone: editDetail.phone || "",
        addressLine1: editDetail.addressLine1 || "",
        ward: editDetail.ward || "",
        city: editDetail.city || "",
        isDefault: editDetail.isDefault || false,
      });
    }
  }, [editDetail]);

  // const addressId = editDetail.id;
  // console.log(addressId);

  const handleChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:4010/api/user-detail/edit/${editDetail.id}`,
        newAddress,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.data.success) throw new Error("Chỉnh sửa không thành công");
      toast.success("Đã chỉnh sửa địa chỉ");
      setUserDetail(res.data);
      setReload((prev) => prev + 1);
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
        className="bg-[#f8f3ef] p-6 rounded-xl shadow-inner border border-[#d7ccc8] w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-[#3e2723] mb-4 border-b border-[#a1887f] pb-2">
          Chỉnh Sửa Địa Chỉ
        </h3>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[#4e342e] font-semibold mb-1">
              Tên người nhận <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="receiverName"
              value={newAddress.receiverName}
              onChange={handleChange}
              className="w-full border border-[#a1887f] rounded-lg p-2 bg-[#fff8f0] text-[#3e2723] focus:outline-none focus:border-[#5d4037]"
            />
          </div>

          <div>
            <label className="block text-[#4e342e] font-semibold mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={newAddress.phone}
              onChange={handleChange}
              className="w-full border border-[#a1887f] rounded-lg p-2 bg-[#fff8f0] text-[#3e2723] focus:outline-none focus:border-[#5d4037]"
            />
          </div>

          <div>
            <label className="block text-[#4e342e] font-semibold mb-1">
              Địa chỉ cụ thể <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="addressLine1"
              value={newAddress.addressLine1}
              onChange={handleChange}
              className="w-full border border-[#a1887f] rounded-lg p-2 bg-[#fff8f0] text-[#3e2723] focus:outline-none focus:border-[#5d4037]"
            />
          </div>

          <div>
            <label className="block text-[#4e342e] font-semibold mb-1">
              Phường/Xã <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ward"
              value={newAddress.ward}
              onChange={handleChange}
              className="w-full border border-[#a1887f] rounded-lg p-2 bg-[#fff8f0] text-[#3e2723] focus:outline-none focus:border-[#5d4037]"
            />
          </div>

          <div>
            <label className="block text-[#4e342e] font-semibold mb-1">
              Thành phố <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={newAddress.city}
              onChange={handleChange}
              className="w-full border border-[#a1887f] rounded-lg p-2 bg-[#fff8f0] text-[#3e2723] focus:outline-none focus:border-[#5d4037]"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              name="isDefault"
              checked={newAddress.isDefault || false}
              onChange={(e) =>
                setNewAddress({ ...newAddress, isDefault: e.target.checked })
              }
              className="accent-[#5d4037]"
            />
            <label className="text-sm text-[#4e342e]">
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-5 py-2 rounded-md bg-[#d7ccc8] hover:bg-[#bcaaa4] text-[#3e2723]"
              onClick={() => setShowEditModal(false)}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-[#3e2723] hover:bg-[#4e342e] text-white font-medium"
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
