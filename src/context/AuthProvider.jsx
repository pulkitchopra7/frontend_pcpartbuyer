import { createContext, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { baseUrl } from "../constants/constants";

export const authContext = createContext(0);

export default function AuthProvider({ children }) {
  const loaderData = useLoaderData();
  const [user, setUser] = useState(loaderData);

  const updateUserData = () => {
    let retryCounts = 3;

    const fetchData = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/v1/user/me`, {
          credentials: "include",
        });
        const resBody = await res.json();
        if (res.ok) {
          setUser(resBody.data);
        } else throw new Error("");
      } catch {
        retryCounts -= 1;
        if (retryCounts > 0) setTimeout(() => fetchData(), 1000);
        else {
          alert("Failed to update user data");
        }
      }
    };
    fetchData();
  };

  return (
    <authContext.Provider value={{ user, setUser, updateUserData }}>
      {children}
    </authContext.Provider>
  );
}
