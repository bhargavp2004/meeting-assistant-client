"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Login() {
  const [formData, setFormData] = useState({});
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    const { email, password } = formData;

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        toast.success("Login successful! Redirecting...", { autoClose: 2000 });
        router.push("/dashboard");
      } else {
        toast.error("Invalid credentials. Try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold text-center text-blue-800">Login</h2>
      <input
        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow mb-4 mt-4"
        type="email"
        name="email"
        placeholder="Email"
        value={formData["email"] || ""}
        onChange={handleChange}
      />

      <input
        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow mb-4"
        type="password"
        name="password"
        placeholder="Password"
        value={formData["password"] || ""}
        onChange={handleChange}
      />

      <button className="bg-blue-500 text-white w-full py-2 mt-4" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
