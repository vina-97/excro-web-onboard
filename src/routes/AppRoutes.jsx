import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";

import { routes as privateRouteConfigs } from "./routes.config"; // 👈 your file
import mapPrivateRoutes from "./mapPrivateRoutes";
import SSOCallback from "../pages/SSOCallback";
export default function AppRoutes() {
  const router = createBrowserRouter([
    {
      element: <PublicRoutes />,
      children: [
        {
          path: "/auth/callback",
          element: <SSOCallback />,
        },
      ],
    },

    {
      element: <PrivateRoutes />,
      children: mapPrivateRoutes(privateRouteConfigs),
    },

    {
      path: "*",
      element: <Navigate to="/auth/callback" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
}
