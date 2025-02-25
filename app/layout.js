"use client";

import Navbar from "./components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";  

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <ToastContainer position="top-right" autoClose={2000} />
        <Navbar />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
