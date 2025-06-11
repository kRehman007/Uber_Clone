import { ImExit } from "react-icons/im";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfrimRidePopUp from "../components/ConfrimRidePopUp";
import { useAppSelector } from "../Redux/Redux-hook";

import { rideResponse } from "../Utils/interfaces";
import toast from "react-hot-toast";
import AxiosInstance from "../Utils/Axios";
import LiveLocation from "../components/LiveLocation";

const CaptainHome = () => {
  const { captain } = useAppSelector((state) => state.captain);
  const { socket } = useAppSelector((state) => state.socket);
  const [ride, setRide] = useState<rideResponse | null>(null);

  useEffect(() => {
    socket.emit("join", { userType: "captain", ID: captain?._id });

    const findCaptainLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            socket.emit("update-captain-location", {
              userID: captain?._id,
              latitude,
              longitude,
            });
          },
          (error) => {
            console.error("Error getting location: ", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    findCaptainLocation();
    const locationInterval = setInterval(findCaptainLocation, 10000);

    return () => clearInterval(locationInterval);
  });

  const RidePopUpRef = useRef(null);
  const ConfrimRidePopUpRef = useRef(null);
  const [RidePopUpPanel, setRidePopUpPanel] = useState(false);
  const [ConfrimRidePopUpPanel, setConfrimRidePopUpPanel] = useState(false);

  useGSAP(() => {
    if (ConfrimRidePopUpPanel) {
      gsap.to(ConfrimRidePopUpRef.current, {
        transform: "translateY(0%)",
        display: "block",
      });
    } else {
      gsap.to(ConfrimRidePopUpRef.current, { transform: "translateY(100%)" });
    }
  }, [ConfrimRidePopUpPanel]);

  useGSAP(() => {
    if (RidePopUpPanel) {
      gsap.to(RidePopUpRef.current, { transform: "translateY(0%)" });
    } else {
      gsap.to(RidePopUpRef.current, { transform: "translateY(100%)" });
    }
  }, [RidePopUpPanel]);

  useEffect(() => {
    socket.on("new-ride", (data: any) => {
      console.log("New ride received:", data);
      setRide(data);
      setRidePopUpPanel(true);
    });

    return () => {
      socket.off("new-ride"); // Clean up listener
    };
  }, [socket]);

  async function confirmRide() {
    toast.promise(
      AxiosInstance.post("/rides/confirm", {
        rideID: ride?._id,
        captainID: captain?._id,
      }),
      {
        loading: "process running",
        success: () => {
          setConfrimRidePopUpPanel(true);
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
    <div className="w-full h-screen overflow-hidden">
      <div className="flex w-full items-center  p-3 justify-between fixed">
        <p className="text-3xl font-sans   leading-normal text-black ">Uber</p>
        <Link
          to="/captain-login"
          className="w-10 h-10  flex items-center justify-center  bg-gray-200 rounded-full "
        >
          {" "}
          <ImExit className="text-lg" />
        </Link>
      </div>

      <div className="h-2/3">
        <LiveLocation />
      </div>
      <div className="h-3/5 p-3">
        <CaptainDetails />
      </div>

      <div
        ref={RidePopUpRef}
        className="fixed bottom-0 w-full z-50 bg-white translate-y-full  p-3"
      >
        <RidePopUp
          confirmRide={confirmRide}
          ride={ride || null}
          setRidePopUpPanel={setRidePopUpPanel}
          setConfrimRidePopUpPanel={setConfrimRidePopUpPanel}
        />
      </div>

      <div
        ref={ConfrimRidePopUpRef}
        className="fixed h-screen bottom-0 w-full z-50 bg-white translate-y-full  py-5 px-2 display-none"
      >
        <ConfrimRidePopUp
          ride={ride || null}
          setConfrimRidePopUpPanel={setConfrimRidePopUpPanel}
          setRidePopUpPanel={setRidePopUpPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
