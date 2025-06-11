import { AdminRoutes } from "./Admin-routes";
import { PublicRoutes } from "./Public-routes";

export const useRoutes = () => {
  return [...AdminRoutes, ...PublicRoutes];
};
