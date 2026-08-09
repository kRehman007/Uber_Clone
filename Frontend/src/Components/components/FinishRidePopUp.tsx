import { FaLocationDot } from "react-icons/fa6";

import { useNavigate } from "react-router-dom";
import { rideResponse } from "../Utils/interfaces";
import { formatDistance } from "../Utils/formatDistance";
import toast from "react-hot-toast";
import AxiosInstance from "../Utils/Axios";
import { Button } from "../ui/button";

interface setFinishRidingPanelProp {
  rideData: rideResponse | null;
  setFinishRidingPanel: (value: boolean) => void;
}

const FinishRidePopUp: React.FC<setFinishRidingPanelProp> = ({ rideData }) => {
  const navigate = useNavigate();

  function endRide() {
    toast.promise(
      AxiosInstance.post("/rides/end-ride", { rideID: rideData?._id }),
      {
        loading: "process running",
        success: () => {
          navigate("/captain-home");
          return "";
        },
        error: (error: any) => {
          console.log("error in ending ride", error);
          return error?.response?.data?.error;
        },
      }
    );
  }

  return (
    <div>
      <div className="p-4">
        <h4 className="text-xl font-semibold">Finish this Ride!</h4>

        <div className="flex justify-between items-center mt-4 p-3 bg-yellow-400 rounded-lg">
          <div className="flex items-center gap-3">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlfGVufDB8fDB8fHww"
            />
            <h2 className="text-sm font-semibold capitalize">
              {rideData?.user.fullname.firstname +
                " " +
                rideData?.user.fullname.lastname}
            </h2>
          </div>
          <h2 className="text-medium font-semibold">
            {formatDistance(rideData?.distance)}
          </h2>
        </div>

        <div className="flex gap-5 items-center p-2 mb-2 border-b mt-3">
          <h2 className="h-6 w-6 bg-[#eee] flex items-center justify-center rounded-full">
            <FaLocationDot className="text-xs" />
          </h2>
          <div>
            <h2 className="text-sm font-semibold">562/11-A</h2>
            <p className="text-sm">{rideData?.pickup}</p>
          </div>
        </div>
        <div className="flex gap-5 items-center p-2 my-2 border-b">
          <h2 className="h-6 w-6 bg-[#eee] flex items-center justify-center rounded-full">
            <FaLocationDot className="text-xs" />
          </h2>
          <div>
            <h2 className="text-sm font-semibold">562/11-A</h2>
            <p className="text-sm">{rideData?.destination}</p>
          </div>
        </div>
        <div className="flex gap-5 items-center p-2 my-2">
          <h2 className="h-6 w-6 bg-[#eee] flex items-center justify-center rounded-full">
            <FaLocationDot className="text-xs" />
          </h2>
          <div>
            <h2 className="text-sm font-semibold">{rideData?.fare}</h2>
            <p className="text-sm">Cash Cash</p>
          </div>
        </div>
        <div>
          <Button onClick={endRide} className="bg-green-600 w-full  ">
            Finish Ride
          </Button>
          <p className="text-xs mt-1 text-gray-500 text-center">
            Click on the Finish Ride Button if you are completed the payment!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinishRidePopUp;
