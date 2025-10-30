const UserDetail = ({userDetail}) => {
  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title">Thông Tin Người Nhận</h2>
        {userDetail?.data?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Receiver</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Postal</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                {userDetail.data.map((item) => (
                  <tr key={item._id}>
                    <td>{item.receiverName}</td>
                    <td>{item.phone}</td>
                    <td>{item.addressLine1}</td>
                    <td>{item.city}</td>
                    <td>{item.state}</td>
                    <td>{item.postalCode}</td>
                    <td>{item.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Không tìm thấy thông tin người nhận.</p>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
