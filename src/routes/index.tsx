import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout";
import Home from "../screens/public/home";
import Detail from "../screens/private/detail";
import Dashboard from "../screens/private/dashboard";

import Login from "../screens/public/login";
import Register from "../screens/public/register";
import { PrivateRoutes } from "./PrivateRoutes";
import CreateNew from "../screens/private/dashboard/createNew";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/detail/:id",
        element: (
          <PrivateRoutes>
            <Detail />{" "}
          </PrivateRoutes>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoutes>
            <Dashboard />
          </PrivateRoutes>
        ),
      },
      {
        path: "/add-new",
        element: (
          <PrivateRoutes>
            <CreateNew />{" "}
          </PrivateRoutes>
        ),
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);
