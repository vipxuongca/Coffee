import React, { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";

const Orders = () => {
  const { token } = useContext(AdminContext);
  return <div>Orders</div>;
};

export default Orders;
