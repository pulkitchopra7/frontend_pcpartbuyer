import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { baseUrl } from "./constants/constants.js";
import RootLayout from "./routes/RootLayout.jsx";
import Home from "./routes/Home.jsx";
import Products from "./routes/Products.jsx";
import ProductDetails from "./routes/ProductDetails.jsx";
import AboutUs from "./routes/AboutUs.jsx";
import UserForm from "./routes/UserForm.jsx";
import Me from "./routes/Me.jsx";
import Cart from "./routes/Cart.jsx";
import NotFound from "./routes/NotFound.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    loader,
    shouldRevalidate: () => false, //so loader doesnt run after initial render
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/products/:productId",
        element: <ProductDetails />,
      },

      {
        path: "/aboutus",
        element: <AboutUs />,
      },
      {
        path: "/login",
        element: <UserForm formType="login" />,
      },
      {
        path: "/forgotpassword",
        element: <UserForm formType="forgotpassword" />,
      },
      {
        path: "/resetpassword/:token",
        element: <UserForm formType="resetpassword" />,
      },

      {
        path: "/signup",
        element: <UserForm formType="signup" />,
      },
      {
        path: "/me",
        element: <Me />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

async function loader() {
  try {
    const res = await fetch(`${baseUrl}/api/v1/user/me`, {
      credentials: "include",
    });
    const resBody = await res.json();
    if (res.ok) return resBody.data;
    else return undefined;
  } catch {
    return undefined;
  }
}
