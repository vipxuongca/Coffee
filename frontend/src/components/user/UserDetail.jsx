import { useState } from "react";
import UserAddModal from "./UserAddModal";
import UserEditModal from "./UserEditModal";

import { toast } from "react-toastify";

const UserDetail = ({ userDetail }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Placeholder handlers for edit/delete

  const handleDelete = async (id) => {
    toast.warn(`Xóa địa chỉ: ${id}`);
  };

  const handleDefault = async (id) => {
    toast.info(`Set Default: ${id}`);
  };

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title">Thông Tin Người Nhận</h2>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddModal(true)}
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
                      onClick={() => handleDefault(item._id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Sửa"
                    >
                      ✔
                    </button>
                    <button
                      onClick={() => setShowEditModal(true)}
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
      <UserAddModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
      />
      <UserEditModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        // detail={item}
      />
    </div>
  );
};

export default UserDetail;
