import Captainlogin from "../Pages/Captainlogin";
import Captainsignup from "../Pages/Captainsignup";
import Start from "../Pages/Start";
import Userlogin from "../Pages/Userlogin";
import Usersignup from "../Pages/Usersignup";
import { URL } from "./URL";

interface Route {
  link: string;
  element: React.ComponentType;
  isProtected?: boolean;
  isUser?: boolean;
}

export const PublicRoutes: Route[] = [
  {
    link: URL.START,
    element: Start,
    isProtected: false,
  },
  {
    link: URL.USER.LOGIN,
    element: Userlogin,
    isProtected: false,
  },
  {
    link: URL.USER.SIGNUP,
    element: Usersignup,
    isProtected: false,
  },
  {
    link: URL.CAPTAIN.LOGIN,
    element: Captainlogin,
    isProtected: false,
  },
  {
    link: URL.CAPTAIN.SINGUP,
    element: Captainsignup,
    isProtected: false,
  },
];
