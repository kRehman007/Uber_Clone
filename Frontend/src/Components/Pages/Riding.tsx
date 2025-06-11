import { FaLocationDot } from "react-icons/fa6";
import { Button } from "../ui/button";
import { IoHome } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../Redux/Redux-hook";
import { useEffect } from "react";
import LiveLocation from "../components/LiveLocation";

const Riding = () => {
  const location = useLocation();
  const rideData = location?.state;
  const { socket } = useAppSelector((state) => state.socket);
  const navigate = useNavigate();
  useEffect(() => {
    socket.on("ride-ended", () => {
      navigate("/home");
    });
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden">
      <Link
        to="/home"
        className="w-10 h-10 absolute flex items-center justify-center right-5 bg-gray-400 rounded-full top-5"
      >
        {" "}
        <IoHome className="text-xl" />
      </Link>
      <div className="h-1/3">
        <LiveLocation />
      </div>
      <div className=" p-3 pb-6 -mt-2 md:mt-0">
        <div className="w-full  flex items-center justify-between p-2">
          <img
            className="h-16"
            src="data:image/jpeg;base64,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"
          />
          <div className="text-right">
            <p className="text-medium font-semibold capitalize">
              {rideData?.captain?.fullname.firstname +
                " " +
                rideData?.captain?.fullname.lastname}
            </p>
            <p className="font-bold text-xl">
              {rideData?.captain.vehicle.plate}
            </p>
            <p className="text-sm text-gray-500">Maruti Suzuki M11</p>
          </div>
        </div>
        <div className="flex gap-5 items-center p-2 my-2 -mt-3 border-b">
          <h2 className="flex items-center justify-center rounded-full">
            <FaLocationDot className="text-sm" />
          </h2>
          <div>
            <h2 className="text-medium font-semibold">562/11-A</h2>
            <p className="text-sm">{rideData?.pickup}</p>
          </div>
        </div>
        <div className="flex gap-5 items-center p-2 ">
          <h2 className=" flex items-center justify-center rounded-full">
            <FaLocationDot className="text-sm" />
          </h2>
          <div>
            <h2 className="text-medium font-semibold">562/11-A</h2>
            <p className="text-sm">{rideData?.destination}</p>
          </div>
        </div>
        <Button className="bg-green-600 w-full mt-6">Make a Payment</Button>
      </div>
    </div>
  );
};

export default Riding;
