import { ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import AxiosInstance from "../Utils/Axios";
import { useAppDispatch } from "../Redux/Redux-hook";
import { removeUser, setUser } from "../Redux/Slices/user-Slice";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

interface UserProtectedRouteProps {
  children: ReactNode;
}

const UserProtectedRoute: React.FC<UserProtectedRouteProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    toast.promise(AxiosInstance.get("/auth/validate-user"), {
      loading: "",
      success: (response) => {
        dispatch(setUser(response?.data?.user));
        setLoading(false);
        return "";
      },
      error: (error) => {
        console.log("error", error);
        dispatch(removeUser());
        navigate("/login");
        return "";
      },
    });
  }, []);

  if (loading) {
    return <Loader />;
  }
  return <>{children}</>;
};

export default UserProtectedRoute;
