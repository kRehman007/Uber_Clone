import { useRoutes } from "./Components/Utils/useRoutes";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserProtectedRoute from "./Components/Pages/UserProtectedRoute";
import CaptainProtectedRoute from "./Components/Pages/CaptainProtectedRoute";
import { useAppDispatch } from "./Components/Redux/Redux-hook";
import { connectSocket } from "./Components/Redux/Slices/socket-slice";
import { useEffect } from "react";

const App = () => {
const routes = useRoutes();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(connectSocket());
  }, []);

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />

      <Routes>
        {routes.map((route, index) => {
          if (route.isProtected) {
            if (route.isUser) {
              return (
                <Route
                  path={route.link}
                  element={
                    <UserProtectedRoute>
                      <route.element />
                    </UserProtectedRoute>
                  }
                  key={index}
                />
              );
            }

            return (
              <Route
                path={route.link}
                element={
                  <CaptainProtectedRoute>
                    <route.element />
                  </CaptainProtectedRoute>
                }
                key={index}
              />
            );
          }
          return (
            <Route path={route.link} element={<route.element />} key={index} />
          );
        })}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
};

export default App;
