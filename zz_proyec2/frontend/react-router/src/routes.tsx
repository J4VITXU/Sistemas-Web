import Layout from "./components/Layout";

import Home from "./pages/Home";
import DisplayProduct from "./pages/DisplayProducts";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import SignUp from "./pages/SignUp";

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup", 
        element: <SignUp />,
      },
      {
        path: "products/:id",
        element: <DisplayProduct />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
    ],
  },
];
