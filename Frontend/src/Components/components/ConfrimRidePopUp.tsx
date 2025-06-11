import { FaLocationDot } from "react-icons/fa6";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { rideResponse } from "../Utils/interfaces";
import toast from "react-hot-toast";
import AxiosInstance from "../Utils/Axios";
import React, { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

interface ConfrimRidePopUpProp {
  ride: rideResponse | null;
  setConfrimRidePopUpPanel: (value: boolean) => void;
  setRidePopUpPanel: (value: boolean) => void;
}

const ConfrimRidePopUp: React.FC<ConfrimRidePopUpProp> = ({
  setConfrimRidePopUpPanel,
  setRidePopUpPanel,
  ride,
}) => {
  const [otp, setOTP] = useState("");
  const navigate = useNavigate();

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    toast.promise(
      AxiosInstance.get("/rides/start-ride", {
        params: {
          rideID: ride?._id,
          otp: otp,
        },
      }),
      {
        loading: "process running",
        success: () => {
          setConfrimRidePopUpPanel(false);
          setRidePopUpPanel(false);
          navigate("/captain-riding", { state: ride });

          return "";
        },
        error: (error) => {
          console.log("error", error?.response?.data?.error);
          toast.error(error?.response?.data?.error);
          return "";
        },
      }
    );
  }

  return (
    <ScrollArea className="h-screen border-r-2 pr-2">
      <div className="p-4 pt-0">
        <h4 className="text-xl font-semibold">Confrim this Ride to Start!</h4>

        <div className="flex justify-between items-center mt-4 p-3 bg-yellow-400 rounded-lg">
          <div className="flex items-center gap-3">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlfGVufDB8fDB8fHww"
            />
            <h2 className="text-sm font-semibold capitalize">
              {ride?.user.fullname.firstname +
                " " +
                ride?.user.fullname.lastname}
            </h2>
          </div>
          <h2 className="text-medium font-semibold">2Km</h2>
        </div>

        <div className="flex gap-5 items-center p-2 mb-2 border-b mt-3">
          <h2 className="h-6 w-6 bg-[#eee] flex items-center justify-center rounded-full">
            <FaLocationDot className="text-xs" />
          </h2>
          <div>
            <h2 className="text-sm font-semibold">562/11-A</h2>
            <p className="text-sm">{ride?.pickup}</p>
          </div>
        </div>
        <div className="flex gap-5 items-center p-2 my-2 border-b">
          <h2 className="h-6 w-6 bg-[#eee] flex items-center justify-center rounded-full">
            <FaLocationDot className="text-xs" />
          </h2>
          <div>
            <h2 className="text-sm font-semibold">562/11-A</h2>
            <p className="text-sm">{ride?.pickup}</p>
          </div>
        </div>
        <div className="flex gap-5 items-center p-2 my-2">
          <h2 className="h-6 w-6 bg-[#eee] flex items-center justify-center rounded-full">
            <FaLocationDot className="text-xs" />
          </h2>
          <div>
            <h2 className="text-sm font-semibold">{ride?.fare}</h2>
            <p className="text-sm">Cash Cash</p>
          </div>
        </div>
        <div>
          <form onSubmit={handleConfirm}>
            <Input
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              type="text"
              placeholder="Enter OTP"
              className="bg-gray-200"
            />

            <Button className="bg-green-600 flex justify-center mt-5 py-2 text-white text-sm font-semibold rounded-md w-full ">
              Confirm
            </Button>
          </form>
          <Button
            onClick={() => {
              setConfrimRidePopUpPanel(false);
              setRidePopUpPanel(false);
            }}
            className="bg-red-600 w-full mt-2"
          >
            Cancel
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ConfrimRidePopUp;
