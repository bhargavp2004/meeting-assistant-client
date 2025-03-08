import { AuthProvider } from "./components/AuthProvider"; // Adjust the path to your authContext.js
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <AuthProvider>
          <ToastContainer position="bottom-right" autoClose={2000} />
          <Navbar />
          <main className="p-6 mt-5">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
