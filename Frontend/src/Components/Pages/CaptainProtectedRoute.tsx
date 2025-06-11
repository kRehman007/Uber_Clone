import React, { ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import AxiosInstance from "../Utils/Axios";
import { useDispatch } from "react-redux";
import { removeCaptain, setCaptain } from "../Redux/Slices/captain-Slice";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

interface CaptainProtectedRouteProps {
  children: ReactNode;
}

const CaptainProtectedRoute: React.FC<CaptainProtectedRouteProps> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);
  useEffect(() => {
    toast.promise(AxiosInstance.get("/auth/validate-captain"), {
      loading: "",
      success: (response) => {
        console.log("res", response);
        dispatch(setCaptain(response?.data?.captain));
        setloading(false);
        return "";
      },
      error: (response) => {
        console.log("err", response);
        dispatch(removeCaptain());
        navigate("/captain-login");
        return "";
      },
    });
  }, []);

  if (loading) return <Loader />;

  return <>{children}</>;
};

export default CaptainProtectedRoute;
