import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import { APP_ROUTES } from "@/constants";
import { RequireAuth } from "@/components/common/RequireAuth";
import { PublicRoute } from "@/components/common/PublicRoute";

export const router = createBrowserRouter([
  {
    path: APP_ROUTES.HOME,
    element: (
      <RequireAuth>
        <Home />
      </RequireAuth>
    ),
  },
  {
    path: APP_ROUTES.LOGIN,
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
]);
