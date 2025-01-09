import { Outlet } from "react-router-dom";
import AuthProvider from "../context/AuthProvider.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
export default function RootLayout() {
  return (
    <AuthProvider>
      <Header />
      <Outlet />
      <Footer />
    </AuthProvider>
  );
}
