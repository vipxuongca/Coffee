const UserChangePassword = () => {
  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body max-w-md">
        <h2 className="card-title">Thay Đổi Mật Khẩu</h2>
        <form className="space-y-3">
          <input
            type="password"
            placeholder="Mật Khẩu Hiện Tại"
            className="input input-bordered w-full"
          />
          <input
            type="password"
            placeholder="Mật Khẩu Mới"
            className="input input-bordered w-full"
          />
          <input
            type="password"
            placeholder="Nhập Lại Mật Khẩu Mới"
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-primary w-full">
            Cập Nhật
          </button>
        </form>
      </div>
    </div>
  );
};
export default UserChangePassword;
