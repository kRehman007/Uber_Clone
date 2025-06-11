import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";
import AxiosInstance from "../Utils/Axios";
import { useAppDispatch } from "../Redux/Redux-hook";
import { setUser } from "../Redux/Slices/user-Slice";

const formSchema = z.object({
  firstname: z.string().nonempty("Firstname is required"),
  lastname: z.string().optional(),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters long" }),
});

const Usersignup = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(userData: z.infer<typeof formSchema>) {
    toast.promise(AxiosInstance.post("/users/register", userData), {
      loading: "creating...",
      success: (response) => {
        localStorage.setItem("token", response?.data?.user?.token);
        dispatch(setUser(response?.data?.user));
        toast.success("you are successfully registered");
        navigate("/home");
        return "";
      },
      error: (response) => {
        const errorMessage =
          response?.response?.data?.error ||
          "Something went wrong. Please try again.";
        toast.error(errorMessage);
        return "";
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
            className="space-y-3 w-full  md:w-1/2"
          >
            <FormLabel className="md:text-medium">What's your name?</FormLabel>
            <div className="flex gap-3 mt-0 w-full ">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="md:text-medium">
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
                  <FormLabel className="md:text-medium">
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
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isLoading}
              >
                {form.formState.isLoading ? "Creating..." : "Create Account"}
              </Button>
              <div className="flex justify-center items-center">
                <p>Already have an account?</p>
                <Link to="/login" className="text-blue-600 ml-1">
                  Login here
                </Link>
              </div>
            </div>
          </form>
        </Form>

        <p className="text-[10px]  leading-tight text-gray-500 text-center">
          By procedding, you consent to get calls, WhatsApp or SMS messages,
          includig by automated means, from Uber and its affiliates to the
          number provided.
        </p>
      </div>
    </div>
  );
};

export default Usersignup;
