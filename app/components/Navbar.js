"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { Brain, LogOut, UserCircle2, Menu, X } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  }, [isAuthenticated, router, user]);

  const handleLogout = () => {
    fetch("http://localhost:3000/logout", { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          logout();
          router.push("/");
        }
      })
      .catch(() => router.push("/login"));
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Brain className="h-7 w-7 text-indigo-600" />
            <h1 className="text-xl font-semibold text-gray-800">Meeting Assistant</h1>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!isMenuOpen)} className="text-gray-700">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 ml-auto">
            <button
              onClick={() => router.push("/")}
              className={`relative text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-md text-md font-medium transition-colors ${
                pathname === "/" ? "text-indigo-600 border-b-2 border-indigo-600" : ""
              }`}
            >
              Home
            </button>

            {isAuthenticated && (
              <>
                <button
                  onClick={() => router.push("/dashboard")}
                  className={`relative text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-md text-md font-medium transition-colors ${
                    pathname === "/dashboard" ? "text-indigo-600 border-b-2 border-indigo-600" : ""
                  }`}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => router.push("/meetings/upload")}
                  className={`relative text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-md text-md font-medium transition-colors ${
                    pathname === "/meetings/upload" ? "text-indigo-600 border-b-2 border-indigo-600" : ""
                  }`}
                >
                  Transcribe File
                </button>
              </>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 focus:outline-none"
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border border-gray-300"
                    />
                  ) : (
                    <UserCircle2 className="w-8 h-8 text-gray-600" />
                  )}
                  <span className="text-md font-medium">{user?.username || "User"}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-5 w-5 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={() => router.push("/login")}
                  className="text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-md text-md font-medium border border-indigo-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-md font-medium transition-transform transform hover:scale-105"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden flex flex-col space-y-2 mt-4 bg-white shadow-lg p-4 rounded-md">
            <button onClick={() => router.push("/")} className="text-gray-700 hover:text-indigo-600">
              Home
            </button>
            {isAuthenticated && (
              <>
                <button onClick={() => router.push("/dashboard")} className="text-gray-700 hover:text-indigo-600">
                  Dashboard
                </button>
                <button onClick={() => router.push("/meetings/upload")} className="text-gray-700 hover:text-indigo-600">
                  Transcribe File
                </button>
              </>
            )}
            {!isAuthenticated ? (
              <>
                <button onClick={() => router.push("/login")} className="text-indigo-600 hover:text-indigo-700">
                  Sign In
                </button>
                <button onClick={() => router.push("/register")} className="text-indigo-600 hover:text-indigo-700">
                  Sign Up
                </button>
              </>
            ) : (
              <button onClick={handleLogout} className="text-gray-700 hover:text-red-600">
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
