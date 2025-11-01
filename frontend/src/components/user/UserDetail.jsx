import { useState, useEffect, useContext } from "react";
import UserAddModal from "./UserAddModal";
import UserEditModal from "./UserEditModal";
import { toast } from "react-toastify";
import { ShopContext } from "../../context/ShopContext";
import axios from "axios";
import Swal from "sweetalert2";

const UserDetail = ({ asModal = false, showModal, setShowModal }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userDetail, setUserDetail] = useState([]);
  const [editDetail, setEditDetail] = useState(null);
  const { token, setLoading, reloadAddress, setReloadAddress } =
    useContext(ShopContext);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const res = await axios.get("http://localhost:4010/api/user-detail", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDetail(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetail();
  }, [token, reloadAddress]);

  const handleDelete = async (e, itemId) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: "Xóa địa chỉ?",
      text: "Bạn có chắc muốn xóa địa chỉ này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      width: "300px",
      customClass: {
        title: "text-sm", 
        popup: "p-2", 
      },
    });

    if (!confirm.isConfirmed) return; // User cancelled

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:4010/api/user-detail/delete/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.data.success) throw new Error("Không thể xóa địa chỉ");
      setUserDetail(res.data);
      toast.success("Đã xóa địa chỉ thành công");
      setShowAddModal(false);
      setReloadAddress((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xóa địa chỉ.");
    } finally {
      setLoading(false);
    }
  };
  const handleDefault = async (e, itemId) => {
    e.preventDefault();

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:4010/api/user-detail/default/${itemId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.data.success) throw new Error("Không thể đặt địa chỉ mặc định");
      setUserDetail(res.data);
      toast.success("Đặt địa chỉ mặc định thành công");
      setShowAddModal(false);
      setReloadAddress((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi đặt địa chỉ mặc định.");
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = async (e, item) => {
    e.preventDefault();
    setEditDetail(item);
    console.log(item);
    setShowEditModal(true);
  };

  const content = (
    <div className="card bg-[#f8f3ef] border border-[#d7ccc8] rounded-xl shadow-inner">
      <div className="card-body text-[#3e2723]">
        <div className="flex items-center justify-between border-b border-[#d7ccc8] pb-2 mb-3">
          <h2 className="font-bold text-xl text-[#4e342e]">
            Địa chỉ giao hàng
          </h2>
          <button
            className="bg-[#6d4c41] text-white text-sm px-3 py-1 rounded-md hover:bg-[#5d4037]"
            onClick={() => setShowAddModal(true)}
          >
            + Thêm địa chỉ
          </button>
        </div>

        {userDetail?.data?.length > 0 ? (
          <div className="space-y-4">
            {[...userDetail.data]
              .sort((a, b) => (b.isDefault === true) - (a.isDefault === true))
              .map((item) => (
                <div
                  key={item._id}
                  className={`p-4 rounded-lg border transition-all shadow-sm ${
                    item.isDefault
                      ? "border-[#a1887f] bg-[#fff8f0] shadow-md"
                      : "border-[#d7ccc8] bg-[#fdf8f6]"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg text-[#4e342e]">
                        {item.receiverName}
                      </p>
                      <p className="text-sm">
                        <strong>SĐT:</strong> {item.phone}
                      </p>
                      <p className="text-sm">
                        <strong>Địa chỉ:</strong> {item.addressLine1}
                      </p>
                      <p className="text-sm">
                        <strong>Phường/Xã:</strong> {item.ward}
                      </p>
                      <p className="text-sm">
                        <strong>Tỉnh/Thành Phố:</strong> {item.city}
                      </p>
                      {item.isDefault && (
                        <span className="mt-2 inline-block text-xs font-semibold text-[#3e2723] bg-[#d7ccc8] px-2 py-1 rounded-md">
                          Mặc định
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col items-center gap-2 ml-3">
                      {!item.isDefault && (
                        <button
                          onClick={(e) => handleDefault(e, item._id)}
                          className="text-[#6d4c41] hover:text-[#3e2723]"
                          title="Đặt mặc định"
                        >
                          ✔
                        </button>
                      )}
                      <button
                        onClick={(e) =>
                          handleEdit(e, {
                            id: item._id,
                            receiverName: item.receiverName,
                            phone: item.phone,
                            addressLine1: item.addressLine1,
                            ward: item.ward,
                            city: item.city,
                            isDefault: item.isDefault,
                          })
                        }
                      >
                        ✎
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, item._id)}
                        className="text-[#8d6e63] hover:text-[#4e342e]"
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-[#5d4037] mt-4">Không tìm thấy địa chỉ nào.</p>
        )}
      </div>

      <UserAddModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        setUserDetail={setUserDetail}
      />
      <UserEditModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        setUserDetail={setUserDetail}
        editDetail={editDetail}
      />
    </div>
  );

  if (!asModal) return content;

  return (
    showModal && (
      <dialog
        className="modal modal-open bg-black/30 backdrop-blur-sm flex items-center justify-center"
        onClick={() => setShowModal(false)}
      >
        <div
          className="modal-box bg-[#f8f3ef] border border-[#d7ccc8] rounded-xl shadow-2xl w-full max-w-2xl h-[600px] md:h-[700px] lg:h-[750px]
 overflow-y-auto p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">{content}</div>
          <div className="modal-action p-4 border-t border-[#d7ccc8]">
            <button
              className="bg-[#6d4c41] text-white px-4 py-2 rounded-md hover:bg-[#5d4037]"
              onClick={() => setShowModal(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      </dialog>
    )
  );
};

export default UserDetail;
