import { ImExit } from "react-icons/im";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { IoIosArrowUp } from "react-icons/io";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import FinishRidePopUp from "../components/FinishRidePopUp";
import LiveLocation from "../components/LiveLocation";
import { formatDistance } from "../Utils/formatDistance";

const CaptainRiding = () => {
  const location = useLocation();
  const FinsihRidingRef = useRef(null);
  const [FinishRidingPanel, setFinishRidingPanel] = useState(false);
  const rideData = location?.state;

  useGSAP(() => {
    if (FinishRidingPanel) {
      gsap.to(FinsihRidingRef.current, { transform: "translateY(0%)" });
    } else {
      gsap.to(FinsihRidingRef.current, { transform: "translateY(100%)" });
    }
  }, [FinishRidingPanel]);

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="flex w-full items-center  p-3 justify-between fixed z-10">
        <p className="text-3xl font-sans   leading-normal text-black ">Uber</p>
        <Link
          to="/captain-home"
          className="w-10 h-10  flex items-center justify-center  bg-gray-200 rounded-full "
        >
          {" "}
          <ImExit className="text-lg" />
        </Link>
      </div>
      <div className="h-4/5 bg-red-500 relative z-0">
        <LiveLocation />
      </div>
      <div
        className="h-1/5  bg-yellow-400  relative"
        onClick={() => setFinishRidingPanel(true)}
      >
        <IoIosArrowUp className="w-full absolute top-3 text-2xl text-white text-center" />
        <div className="p-6 pt-11 flex justify-between items-center ">
          <h4 className="text-lg font-semibold">
            {formatDistance(rideData?.distance)} away
          </h4>
          <Button className="bg-green-600">Complete Ride</Button>
        </div>
      </div>

      <div
        ref={FinsihRidingRef}
        className="fixed  bottom-0 w-full z-50 bg-white translate-y-full  py-5 px-2"
      >
        <FinishRidePopUp
          rideData={rideData}
          setFinishRidingPanel={setFinishRidingPanel}
        />
      </div>
    </div>
  );
};

export default CaptainRiding;
