import { MdMoreTime } from "react-icons/md";
import { RiSpeedUpFill } from "react-icons/ri";
import { GiNotebook } from "react-icons/gi";
import { useAppSelector } from "../Redux/Redux-hook";

const CaptainDetails = () => {
  const { captain } = useAppSelector((state) => state.captain);

  return (
    <div>
      <div className="flex justify-between items-center p-2">
        <div className="flex gap-2 items-center">
          <img
            className="w-10 rounded-full h-10"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlfGVufDB8fDB8fHww"
          />
          <p className="text-medium font-medium">{`${captain?.fullname?.firstname} ${captain?.fullname?.lastname}`}</p>
        </div>
        <div className="flex flex-col gap-0 items-end">
          <p className="text-lg font-semibold">$295.25</p>
          <p className="text-gray-500 text-sm -mt-1">Earned</p>
        </div>
      </div>
      <div className="bg-gray-100 mt-2 flex justify-between p-3 rounded-lg">
        <div className="flex flex-col items-center gap-0">
          <MdMoreTime className="font-medium text-medium" />
          <p className="font-medium ">10.2</p>
          <p className="text-sm text-gray-500">Hours online</p>
        </div>
        <div className="flex flex-col items-center gap-0">
          <RiSpeedUpFill className="font-medium text-medium" />
          <p className="font-medium">10.2</p>
          <p className="text-sm text-gray-500">Hours online</p>
        </div>
        <div className="flex flex-col items-center gap-0">
          <GiNotebook className="font-medium text-medium" />
          <p className="font-medium">10.2</p>
          <p className="text-sm text-gray-500">Hours online</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
