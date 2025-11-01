const UserProfile = ({ userDetail }) => {
  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title">Thông tin Tài Khoản</h2>
        <p>
          <strong>Name:</strong> {userDetail?.name || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {userDetail?.email || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
