import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div className="bg-cover bg-center bg-no-repeat bg-[url(https://images.unsplash.com/photo-1591641205863-e17f8293ec77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRyYWZmaWMlMjBsaWdodHN8ZW58MHx8MHx8fDA%3D)] h-screen w-full flex flex-col justify-between pt-9">
      <p className="text-4xl font-sans absolute top-5 left-5   leading-normal text-black ">
        Uber
      </p>
      <div className="bg-white p-4 absolute bottom-0 left-0 right-0  md:pt-5 pb-5">
        <p className=" text-2xl md:text-3xl font-medium">
          Get Started with Uber
        </p>
        <Link
          to="/login"
          className="flex items-center justify-center bg-green-700 py-3 rounded text-white w-full mt-3 md:mt-4 text-xl"
        >
          Continue
        </Link>
      </div>
    </div>
  );
};

export default Start;
