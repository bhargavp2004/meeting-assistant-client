"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch("http://localhost:3000/authenticate", { credentials: "include", method: 'GET' })
            .then((res) => {
                console.log("Response : ", res);
                if (!res.ok) {
                    router.push("/");
                    setIsAuthenticated(false);
                }
                else{
                    router.push("/dashboard");
                    setIsAuthenticated(true);
                }
            })
            .catch(() => router.push("/login"));
    }, [router]);


    const handleLogout = () => {
        fetch("http://localhost:3000/logout", { credentials: "include" })
            .then((res) => {
                if (res.ok) {
                    router.push("/login");
                    setIsAuthenticated(false);
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
