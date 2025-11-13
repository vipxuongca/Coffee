import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const UserProfile = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="bg-[#fff8f0] border border-[#d7ccc8] shadow-inner w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center text-[#3e2723] mb-6 border-b border-[#a1887f] pb-2">
          THÔNG TIN TÀI KHOẢN
        </h1>

        <div className="space-y-4 text-[#3e2723]">
          <div>
            <p className="font-semibold">Tên tài khoản:</p>
            <p className="text-sm text-[#5d4037]">{user?.name || "N/A"}</p>
          </div>

          <div>
            <p className="font-semibold">Email:</p>
            <p className="text-sm text-[#5d4037]">{user?.email || "N/A"}</p>
          </div>

          {/* <div>
            <p className="font-semibold">Ngày tạo:</p>
            <p className="text-sm text-[#5d4037]">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleString("vi-VN")
                : "N/A"}
            </p>
          </div> */}

          {/* <div>
            <p className="font-semibold">Cập nhật gần nhất:</p>
            <p className="text-sm text-[#5d4037]">
              {user?.updatedAt
                ? new Date(user.updatedAt).toLocaleString("vi-VN")
                : "N/A"}
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
