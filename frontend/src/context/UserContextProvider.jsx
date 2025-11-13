import { UserContext } from "./UserContext";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { userApi } from "../../api/user-api";
import { ShopContext } from "./ShopContext";

const UserContextProvider = (props) => {
  const [user, setUser] = useState({});
  const { showLoading, token } = useContext(ShopContext);

  const getUserData = async () => {
    try {
      const response = await userApi.single();
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) getUserData();
  }, [token]);

  const value = {
    user,
  };

  return (
    <UserContext.Provider value={value}>
      {showLoading && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-white p-6  shadow-lg flex flex-col items-center">
            <ClipLoader color="#3e2723" size={60} />
            <p className="text-gray-700 font-medium mt-2">Loading...</p>
          </div>
        </div>
      )}
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
