import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import { APP_ROUTES } from "@/constants";

export const router = createBrowserRouter([
  {
    path: APP_ROUTES.HOME,
    element: <Home />,
  },
  {
    path: APP_ROUTES.LOGIN,
    element: <Login />,
  },
]);
