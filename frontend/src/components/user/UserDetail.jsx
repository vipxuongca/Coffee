import { useState, useEffect, useContext } from "react";
import UserAddModal from "./UserAddModal";
import UserEditModal from "./UserEditModal";
import { toast } from "react-toastify";
import { ShopContext } from "../../context/ShopContext";
import axios from "axios";

const UserDetail = ({ asModal = false, showModal, setShowModal }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [userDetail, setUserDetail] = useState([]);
  const [reload, setReload] = useState(0);

  const { token, setLoading } = useContext(ShopContext);

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
  }, [token, reload]);

  const handleDelete = async (id) => toast.warn(`Xóa địa chỉ: ${id}`);
  const handleDefault = async (id) => toast.info(`Set Default: ${id}`);

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
                          onClick={() => handleDefault(item._id)}
                          className="text-[#6d4c41] hover:text-[#3e2723]"
                          title="Đặt mặc định"
                        >
                          ✔
                        </button>
                      )}
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="text-[#6d4c41] hover:text-[#3e2723]"
                        title="Sửa"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
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
        setReload={setReload}
      />
      <UserEditModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        userDetail={userDetail}
        setUserDetail={setUserDetail}
        setReload={setReload}
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
          className="modal-box bg-[#f8f3ef] border border-[#d7ccc8] rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-0"
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
