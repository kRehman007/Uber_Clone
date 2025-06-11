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
import { setUser } from "../Redux/Slices/user-Slice";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().nonempty("Password is required"),
});

const Userlogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(userData: z.infer<typeof formSchema>) {
    toast.promise(AxiosInstance.post("/users/login", userData), {
      loading: "logging in...",
      success: (response) => {
        console.log(response?.data?.user);
        localStorage.setItem("token", response?.data?.user?.token);
        dispatch(setUser(response?.data?.user));
        navigate("/home");
        toast.success("You are successfully login");
        return "";
      },
      error: (response) => {
        toast.error(
          response?.response?.data?.error ||
            "Something went wrong. Please try again."
        );
        return "";
      },
    });
  }
  return (
    <div className="w-full h-screen p-5 pb-10 flex flex-col gap-0  ">
      {/* <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAY1BMVEUAAAD///91dXXNzc3z8/OBgYGSkpKOjo56enrT09Pn5+e9vb3v7+/29vZ9fX1YWFjg4OBeXl7GxsZtbW04ODg+Pj6mpqZPT0+ampouLi4pKSm1tbVoaGiIiIgNDQ0cHBxHR0cOgNbaAAACtElEQVRoge2X25qqIBSAxUOFRzRTzCzf/ym3nBSQiqk9F/N9678ZhhX8uORkEAAAAAAAAAAAAAAAAAAA8Jdpy9OprJ/WXlhh/g3xCS3gp7UTKxx+QxyynqOntQkrHEEMYhD/X3F7GMduujh7aZOuo+HVGbu2zjae4p4ixdhbP751KpTS1c23IBpUGft7/1hMY7QRU+O3VAshUuo9THWBvhFTjEzwlrxLasXoY+uhydFXYvm4eRQR2Xu+emVN3DRqdN3Wg+JTMVd1ovVRPCGRL1N4x1aPlbqY0LraHX4/EG/JbRuRUaFixSJZY/yp03YTdw+X1F/c6EE+UREriblTaTGski3E2TOtp5gY474T1fth17kYiuoh1sf0idhauYMaDLOk5vaQyRy4+/2hOLfDbJUUdXB3tO3lBOA9jF+KOzvM94xEvsfYIJcteezVnemjQ4LXTmJOu/ARn53i0hAnzvBRzC0X2EPM3wm2txb6+okn8cTJPtOcovEQX/nsma1abIh3c2RktWFQvZhAb8UBz01p1omdf1tOrjZsjTqz5SvOHAumQ6bYGlcp36PYqa2gt1h0PelVA7LE5iYh8sE2az6tU6O7+eIrvovjTDvcq9wWr4cR48Gfs2DFKy9ibUPtc/1YfP3tI8+Rdeqe1W1DP53IerRVWEtRuP5QJoONORv8xPK0WeZncr6FNF9Xo3Eeo6bsh2E+iUNx3cxk2+x8Gdo+jPg/eeUpftg3myWRhljdQAhR9xy8a5sSooY8e6Z6obG8tDfEpb036re9zorheXsJ779vb3rTNBFbA1biQ3Ajejw02+qx9crhKV6aY8LyW5CI7cwzjiLc8eqlwES9iMck29+g+gznS7BIo81Uq4bvGerwFNbt63g1OGP3/haea/dXBgAAAAAAAAAAAAAAAAAAf55/IHwe2JcW+JEAAAAASUVORK5CYII="
        className="w-28 ml-5 md:ml-7 mix-blend-overlay flex flex-start"
      /> */}
      <p className="text-4xl font-sans  md:ml-7 leading-normal text-black ">
        Uber
      </p>
      <div className="flex flex-col mt-5 items-center w-full h-screen justify-between">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 w-full  md:w-1/2 "
          >
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
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="flex justify-center items-center">
                <p>New here?</p>
                <Link to="/signup" className="text-blue-600 ml-1">
                  Create new Account
                </Link>
              </div>
            </div>
          </form>
        </Form>
        <Link
          to="/captain-login"
          className="bg-green-700 px-4 py-2 w-full md:w-1/2 rounded text-white text-center mt-5"
        >
          Sigin as Captain
        </Link>
      </div>
    </div>
  );
};

export default Userlogin;
