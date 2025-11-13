import React from "react";

const UserChangePassword = () => {
  return  (
    <div className="flex justify-center py-10 px-4">
      <div className="bg-[#fff8f0] border border-[#d7ccc8] rounded-xl shadow-inner w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center text-[#3e2723] mb-6 border-b border-[#a1887f] pb-2">
          THAY ĐỔI MẬT KHẨU
        </h1>

        <form className="space-y-5">
          <div>
            <label className="block text-[#4e342e] font-semibold mb-1">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu hiện tại"
              className="w-full border border-[#a1887f] rounded-lg p-2 bg-[#fff8f0] text-[#3e2723] focus:outline-none focus:border-[#5d4037]"
              required
            />
          </div>

          <div>
            <label className="block text-[#4e342e] font-semibold mb-1">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              className="w-full border border-[#a1887f] rounded-lg p-2 bg-[#fff8f0] text-[#3e2723] focus:outline-none focus:border-[#5d4037]"
              required
            />
          </div>

          <div>
            <label className="block text-[#4e342e] font-semibold mb-1">
              Nhập lại mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              className="w-full border border-[#a1887f] rounded-lg p-2 bg-[#fff8f0] text-[#3e2723] focus:outline-none focus:border-[#5d4037]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-[#3e2723] hover:bg-[#4e342e] text-white font-medium transition-all"
          >
            Cập nhật mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserChangePassword;
