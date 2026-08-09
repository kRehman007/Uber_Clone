import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AxiosInstance from "../Utils/Axios";
import { useAppDispatch } from "../Redux/Redux-hook";
import { setCaptain } from "../Redux/Slices/captain-Slice";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().nonempty("Password is required"),
});

const Captainlogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(captainData: z.infer<typeof formSchema>) {
    toast.promise(AxiosInstance.post("/captains/login", captainData), {
      loading: "logging in...",
      success: (response) => {
        localStorage.setItem("token", response?.data?.captain?.token);
        dispatch(setCaptain(response?.data?.captain));
        navigate("/captain-home");
        return "You are succesffully login..";
      },
      error: (response) => {
        return (
          response?.response?.data?.error ||
          "Something went wrong. Please try again."
        );
      },
    });
  }
  return (
    <div className="w-full h-screen p-5 pb-10 flex flex-col gap-0  ">
      <p className="text-4xl font-sans  md:ml-7 leading-normal text-black ">
        Uber
      </p>
      <div className="flex flex-col mt-5 items-center w-full h-screen justify-between">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full  md:w-1/2 "
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-medium">
                    What's your email?
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="email@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-medium">
                    Enter your password
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="flex justify-center items-center">
                <p>Join a fleet?</p>
                <Link to="/captain-signup" className="text-blue-600 ml-1">
                  Register as a Captain
                </Link>
              </div>
            </div>
          </form>
        </Form>

        <Link
          to="/login"
          className="bg-orange-700 px-4 py-2 w-full md:w-1/2 rounded text-white text-center mt-5"
        >
          Sigin as User
        </Link>
      </div>
    </div>
  );
};

export default Captainlogin;
