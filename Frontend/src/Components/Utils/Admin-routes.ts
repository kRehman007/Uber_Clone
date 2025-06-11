import CaptainHome from "../Pages/CaptainHome";
import CaptainRiding from "../Pages/CaptainRiding";
import Home from "../Pages/Home";
import Riding from "../Pages/Riding";
import { URL } from "./URL";

interface Route {
  link: string;
  element: React.ComponentType;
  isProtected?: boolean;
  isUser?: boolean;
}
export const AdminRoutes: Route[] = [
  {
    link: URL.HOME,
    element: Home,
    isProtected: true,
    isUser: true,
  },
  {
    link: URL.CAPTAIN.HOME,
    element: CaptainHome,
    isProtected: true,
    isUser: false,
  },
  {
    link: URL.USER.RIDING,
    element: Riding,
    isProtected: true,
    isUser: true,
  },
  {
    link: URL.CAPTAIN.RIDING,
    element: CaptainRiding,
    isProtected: true,
    isUser: false,
  },
];
