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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AxiosInstance from "../Utils/Axios";
import { useAppDispatch } from "../Redux/Redux-hook";
import { setCaptain } from "../Redux/Slices/captain-Slice";

const formSchema = z.object({
  firstname: z.string().nonempty("firstname is required"),
  lastname: z.string().optional(),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters long" }),
  color: z.string().nonempty("vehicle-color is required"),
  plate: z.string().nonempty("vehicle-plate is required"),
  capacity: z.number().positive("Capacity must be greater than 0"),
  vehicleType: z.string().nonempty("vehicle-type is required"),
});

const Captainsignup = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      color: "",
      plate: "",
      capacity: 0,
      vehicleType: "",
    },
  });

  function onSubmit(captainData: z.infer<typeof formSchema>) {

    toast.promise(AxiosInstance.post("/captains/register", captainData), {
      loading: "signing up...",
      success: (response) => {

        localStorage.setItem("token", response?.data?.captain?.token);
        dispatch(setCaptain(response?.data?.captain));
        navigate("/captain-home");
        toast.success("you are successfully registered");
        return "";
      },
      error: (response) => {
        console.log("error", response?.response?.data?.error);
        return (
          response?.response?.data?.error ||
          "Something went wrong. Please try again."
        );
      },
    });
  }
  return (
    <div className="w-full md:h-screen p-5  flex flex-col gap-0  ">
      <p className="text-4xl font-sans  md:ml-7 leading-normal text-black ">
        Uber
      </p>
      <div className="flex flex-col mt-5 items-center  w-full h-screen justify-between">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 w-full  md:w-1/2"
          >
            <div>
              <FormLabel className="md:text-medium ">
                What's your name?
              </FormLabel>
              <div className="flex gap-3 mt-2 w-full ">
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
              <FormLabel className="md:text-medium">
                What's your vehhicle?
              </FormLabel>
              <div className="grid grid-cols-2 gap-3  mt-2   w-full ">
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="vehicle color"
                          {...field}
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="plate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="vehicle plate"
                          {...field}
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="vehicle capacity"
                          {...field}
                          type="number"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Vehicle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="car">Car</SelectItem>
                              <SelectItem value="motorcycle">
                                Motorcycle
                              </SelectItem>
                              <SelectItem value="auto">Auto</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full">
                Signup
              </Button>
              <div className="flex justify-center items-center">
                <p>Already have an account?</p>
                <Link to="/captain-login" className="text-blue-600 ml-1">
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

export default Captainsignup;
