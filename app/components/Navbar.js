"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";

export default function Navbar() {
  const { isAuthenticated, login, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("is authenticated : ", isAuthenticated)
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    fetch("http://localhost:3000/logout", { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          logout();
        }
      })
      .catch(() => router.push("/login"));
  };

  return (
    <nav className="shadow-md p-4 bg-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Meeting Assistant
        </Link>

        <div className="space-x-4">
          <Link href="/" className="text-gray-800 hover:text-blue-600">
            Home
          </Link>

          {!isAuthenticated ? (
            <>
              <Link href="/register" className="text-gray-800 hover:text-blue-800">
                Register
              </Link>
              <Link href="/login" className="text-gray-800 hover:text-blue-800">
                Login
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="text-gray-800 hover:text-blue-800">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
