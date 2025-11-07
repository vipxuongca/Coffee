import { useState, useEffect, useContext } from "react";
import { MapPin, Pencil } from "lucide-react";
import { ShopContext } from "../../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import UserDetail from "./UserDetail";

const UserDetailAddress = () => {
  const { token, setLoading, reloadAddress, setDefaultAddress, defaultAddress } =
    useContext(ShopContext);
  // const [defaultAddress, setDefaultAddress] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const fetchDefaultAddress = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:4002/api/user-detail", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success && res.data.data.length > 0) {
          const def = res.data.data.find((a) => a.isDefault);
          setDefaultAddress(def || null);
        } else {
          setDefaultAddress(null);
        }
      } catch (err) {
        console.error("Error fetching default address:", err);
        // toast.error("Không thể tải địa chỉ mặc định.");
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultAddress();
  }, [token, reloadAddress]);

  return (
    <div className="max-w-3xl mx-auto p-8 bg-[#f8f3ef] rounded-xl shadow-inner border border-[#d7ccc8] mt-10">
      {defaultAddress ? (
        <div className="mb-6 bg-[#fff8f0] p-4 rounded-xl border border-[#d7ccc8] relative">
          <div className="flex items-center gap-2 text-[#4e342e] mb-2">
            <MapPin size={18} />
            <span className="font-semibold">Địa chỉ giao hàng</span>
          </div>
          <p className="text-[#3e2723] font-medium">
            {defaultAddress.receiverName} — {defaultAddress.phone}
          </p>
          <p className="text-[#5d4037] text-sm">
            {defaultAddress.addressLine1}, {defaultAddress.ward},{" "}
            {defaultAddress.city}
          </p>
          <button
            onClick={() => setShowDetailModal(true)}
            className="absolute top-3 right-3 text-[#5d4037] hover:text-[#3e2723] flex items-center gap-1 text-sm"
          >
            <Pencil size={14} /> Sửa địa chỉ
          </button>
        </div>
      ) : (
        <div className="text-center text-[#5d4037] py-6 bg-[#fff8f0] rounded-xl border border-[#d7ccc8]">
          <p>Bạn chưa có địa chỉ mặc định.</p>
          <button
            onClick={() => setShowDetailModal(true)}
            className="mt-3 px-4 py-2 bg-[#3e2723] hover:bg-[#4e342e] text-white rounded-md text-sm"
          >
            Thêm địa chỉ
          </button>
        </div>
      )}

      {/* Full User Detail Modal */}
      <UserDetail
        asModal={true}
        showModal={showDetailModal}
        setShowModal={setShowDetailModal}
      />
    </div>
  );
};

export default UserDetailAddress;
