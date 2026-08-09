import { FaLocationDot } from "react-icons/fa6";
import { Button } from "../ui/button";
import { rideResponse } from "../Utils/interfaces";
import { formatDistance } from "../Utils/formatDistance";

interface setRidePopUpPanel {
  confirmRide: () => void;
  ride: rideResponse | null;
  setRidePopUpPanel: (value: boolean) => void;
  setConfrimRidePopUpPanel: (value: boolean) => void;
}

const RidePopUp: React.FC<setRidePopUpPanel> = ({
  setRidePopUpPanel,
  ride,
  confirmRide,
}) => {
  return (
    <div className="p-4">
      <h4 className="text-xl font-semibold">New Ride Available!</h4>

      <div className="flex justify-between items-center mt-4 p-3 bg-yellow-400 rounded-lg">
        <div className="flex items-center gap-3">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlfGVufDB8fDB8fHww"
          />
          <h2 className="text-sm font-semibold capitalize">
            {ride?.user.fullname.firstname + " " + ride?.user.fullname.lastname}
          </h2>
        </div>
        <h2 className="text-medium font-semibold">
          {formatDistance(ride?.distance)}
        </h2>
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
          <p className="text-sm">{ride?.destination}</p>
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
      <Button
        onClick={() => {
          confirmRide();
        }}
        className="bg-green-600 w-full mt-2"
      >
        Accept
      </Button>
      <Button
        onClick={() => setRidePopUpPanel(false)}
        className="bg-gray-400 w-full mt-2"
      >
        Ignore
      </Button>
    </div>
  );
};

export default RidePopUp;
