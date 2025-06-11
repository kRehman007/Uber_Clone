import { IoIosArrowDown } from "react-icons/io";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRidePanel from "../components/ConfirmRidePanel";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { Input } from "../ui/input";
import { useGetSuggestionsQuery } from "../Redux/RTK/GoogleMapAPI";
import { Button } from "../ui/button";
import AxiosInstance from "../Utils/Axios";
import { FareResponse, UserRideResponse } from "../Utils/interfaces";
import useDebounce from "../Utils/Hooks/useDebounce";
import toast from "react-hot-toast";
import { useAppSelector } from "../Redux/Redux-hook";
import { useNavigate } from "react-router-dom";
import LiveLocation from "../components/LiveLocation";

const Home = () => {
  const { user } = useAppSelector((state) => state.user);
  const { socket } = useAppSelector((state) => state.socket);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("join", { userType: "user", ID: user?._id });
  }, [user?._id]);

  const PanelRef = useRef(null);
  const ArrowRef = useRef(null);
  const VehiclePanelRef = useRef(null);
  const ConfirmRidePanelRef = useRef(null);
  const VehicleFoundRef = useRef(null);
  const WaitingForDriverRef = useRef(null);
  const HeightRef = useRef(null);
  const [Panelopen, setPanelopen] = useState(false);
  const [VehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmRidePanelOpen, setConfirmRidePanelOpen] = useState(false);
  const [vehicleFoundPanel, setVehicleFoundPanel] = useState(false);
  const [WaitingForDriverPanel, setWaitingForDriverPanel] = useState(false);
  const [pickupValue, setPickupValue] = useState("");
  const [destValue, setDestValue] = useState("");
  const [isPickup, setIsPickup] = useState(true);
  const [ride, setRide] = useState<UserRideResponse | null>(null);
  const [selectVehcileType, setSelectVehicleType] =
    useState<keyof FareResponse>("auto");
  const [Fare, setFare] = useState<FareResponse | null>(null);

  const debouncedPickupValue = useDebounce(pickupValue, 300);
  const debouncedDestValue = useDebounce(destValue, 300);
  const { data: pickupSuggestions } = useGetSuggestionsQuery(
    { address: debouncedPickupValue },
    { skip: !debouncedPickupValue }
  );
  const { data: destSuggestions } = useGetSuggestionsQuery(
    { address: debouncedDestValue },
    { skip: !debouncedDestValue }
  );

  function handlePickupChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPickupValue(e.target.value);
    setIsPickup(true);
  }

  function handleDestChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDestValue(e.target.value);
    setIsPickup(false);
  }

  function handleSuggestionClick(suggestion: string) {
    if (isPickup) {
      setPickupValue(suggestion);
    } else {
      setDestValue(suggestion);
    }
  }

  useGSAP(
    function () {
      if (Panelopen) {
        gsap.to(PanelRef.current, {
          height: "60%",
          transform: "translateY(0)",
          padding: "15px",
        });
        gsap.to(ArrowRef.current, { opacity: 1 });
      } else {
        gsap.to(PanelRef.current, {
          transform: "translateY(100)",
          padding: "0px",
          height: "0%",
        });
      }
    },
    [Panelopen]
  );
  useGSAP(() => {
    if (VehiclePanelOpen) {
      gsap.to(VehiclePanelRef.current, {
        transform: "translateY(0%)",
        padding: "15px",
        zIndex: "1000",
      });
    } else {
      gsap.to(VehiclePanelRef.current, { transform: "translateY(100%)" });
    }
  }, [VehiclePanelOpen]);

  useGSAP(() => {
    if (confirmRidePanelOpen) {
      gsap.to(ConfirmRidePanelRef.current, {
        transform: "translateY(0%)",
        padding: "15px",
        position: "fixed",
        bottom: "0",
      });
    } else {
      gsap.to(ConfirmRidePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [confirmRidePanelOpen]);

  useGSAP(() => {
    if (vehicleFoundPanel) {
      gsap.to(VehicleFoundRef.current, {
        transform: "translateY(0%)",
        padding: "15px",
        position: "fixed",
        bottom: "0",
      });
    } else {
      gsap.to(VehicleFoundRef.current, {
        transform: "translateY(100%)",
        padding: "0px",
      });
    }
  }, [vehicleFoundPanel]);

  useGSAP(() => {
    if (WaitingForDriverPanel) {
      gsap.to(WaitingForDriverRef.current, {
        transform: "translateY(0%)",
        padding: "15px",
        zIndex: "1000",
      });
    } else {
      gsap.to(WaitingForDriverRef.current, { transform: "translateY(100%)" });
    }
  }, [WaitingForDriverPanel]);

  async function findTrip() {
    if (!pickupValue || !destValue) {
      toast.error("All fileds are required");
      return;
    }

    toast.promise(
      AxiosInstance.get("/rides/get-fare", {
        params: { pickup: pickupValue, destination: destValue },
      }),
      {
        loading: "finding your trip",
        success: (response) => {
          setFare(response?.data);
          setVehiclePanelOpen(true);
          setPanelopen(false);
          return "";
        },
        error: (response) => {
          toast.error(response?.response?.data?.error);
          return "";
        },
      }
    );

    const response = await AxiosInstance.get("/rides/get-fare", {
      params: { pickup: pickupValue, destination: destValue },
    });
    setVehiclePanelOpen(true);
    setPanelopen(false);
    console.log("response", response.data);
    setFare(response?.data);
  }
  async function createRide() {
    try {
      const response = await AxiosInstance.post("/rides/create", {
        pickup: pickupValue,
        destination: destValue,
        vehicleType: selectVehcileType,
      });
      console.log("created", response);
    } catch (error) {
      console.log("error in creating ride", error);
    }
  }
  socket.on("ride-confirm", (data: UserRideResponse) => {
    setRide(data);
    setVehicleFoundPanel(false);
    setWaitingForDriverPanel(true);
  });
  socket.on("ride-started", (ride: UserRideResponse) => {
    setWaitingForDriverPanel(false);
    console.log("started", ride);
    navigate("/riding", { state: ride });
  });

  return (
    <div className="h-screen w-full  overflow-hidden">
      <div className="h-[70%]">
        <LiveLocation />
      </div>

      <p className="text-4xl font-sans absolute top-5 left-5   leading-normal text-black ">
        Uber
      </p>
      <div className="flex flex-col absolute bottom-0 justify-end w-full p-0 h-screen overflow-hidden ">
        <div ref={HeightRef} className="h-[30%] bg-white  px-4 py-2  relative">
          <div ref={ArrowRef} className="opacity-0">
            <IoIosArrowDown
              className="absolute right-6 top-4 text-xl "
              onClick={() => setPanelopen(false)}
            />
          </div>
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <p className="h-20 w-1 bg-black absolute left-7 top-[67px]"></p>
          <form>
            <Input
              value={pickupValue}
              onClick={() => {
                setPanelopen(true);
                gsap.to(HeightRef.current, { height: "40%" });
              }}
              onChange={handlePickupChange}
              type="text"
              placeholder="Add a pick-up location"
              className="py-5 px-20 my-3 mt-5"
            />
            <Input
              value={destValue}
              onClick={() => {
                setPanelopen(true);
                gsap.to(HeightRef.current, { height: "40%" });
              }}
              onChange={handleDestChange}
              type="text"
              placeholder="Enter your destination"
              className="py-5 px-20 my-3"
            />
          </form>
          <Button className="w-full" onClick={findTrip}>
            Find Trip
          </Button>
        </div>
        <div className="bg-white" ref={PanelRef}>
          <LocationSearchPanel
            setVehiclePanelOpen={setVehiclePanelOpen}
            setPanelopen={setPanelopen}
            suggestions={
              isPickup ? pickupSuggestions || [] : destSuggestions || []
            }
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
      </div>

      <div ref={VehiclePanelRef} className="fixed bottom-0 w-full  bg-white  ">
        <VehiclePanel
          setVehiclePanelOpen={setVehiclePanelOpen}
          setConfirmRidePanelOpen={setConfirmRidePanelOpen}
          fare={Fare}
          setSelectVehicleType={setSelectVehicleType}
        />
      </div>

      <div
        ref={ConfirmRidePanelRef}
        className=" w-full  bg-white translate-y-full"
      >
        <ConfirmRidePanel
          pickup={pickupValue}
          destination={destValue}
          vehicleType={selectVehcileType}
          fare={Fare}
          createRide={createRide}
          setConfirmRidePanelOpen={setConfirmRidePanelOpen}
          setVehicleFoundPanel={setVehicleFoundPanel}
        />
      </div>

      <div
        ref={VehicleFoundRef}
        className=" w-full  bg-white translate-y-full "
      >
        <LookingForDriver
          setVehicleFoundPanel={setVehicleFoundPanel}
          pickup={pickupValue}
          destination={destValue}
          vehicleType={selectVehcileType}
          fare={Fare}
        />
      </div>

      <div
        ref={WaitingForDriverRef}
        className="fixed bottom-0 w-full  bg-white  "
      >
        <WaitingForDriver
          ride={ride || null}
          setWaitingForDriverPanel={setWaitingForDriverPanel}
        />
      </div>
    </div>
  );
};

export default Home;
