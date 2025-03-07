"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { Brain, Settings, LogOut } from "lucide-react";

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
    // <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
    //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //       <div className="flex justify-between h-16">
    //         <div className="flex items-center space-x-8">
    //           <h1 className="text-xl font-bold text-gray-800 flex items-center cursor-pointer" onClick={() => router.push("/home")}> 
    //             <Brain className="h-6 w-6 mr-2 text-indigo-600" />
    //             Meeting Assistant
    //           </h1>
    //           <div className="hidden md:flex space-x-4">
    //             <button onClick={() => router.push("/dashboard")} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
    //               Dashboard
    //             </button>
    //             <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
    //               Meetings
    //             </button>
                
    //           </div>
    //         </div>
    //         <div className="flex items-center space-x-4">
    //           <button className="text-gray-500 hover:text-gray-700">
    //             <Settings className="h-5 w-5" />
    //           </button>
    //           <button onClick={() => router.push("/login")} className="text-gray-500 hover:text-gray-700">
    //             <LogOut className="h-5 w-5" />
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </nav>

    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 
              onClick={() => router.push('/home')}
              className="text-xl font-bold text-gray-800 cursor-pointer flex items-center"
            >
              <Brain className="h-6 w-6 mr-2 text-indigo-600" />
              Meeting Assistant
            </h1>
            {isAuthenticated && (
              <div className="hidden md:flex space-x-4">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </button>
                {/* <button onClick={() => router.push("/")} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Meetings
                </button> */}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button className="text-gray-500 hover:text-gray-700">
                  <Settings className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => {
                    handleLogout();
                    setisAuthenticated(false);
                    router.push("/home")
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={() => router.push('/login')}
                  className="text-indigo-600 hover:text-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
