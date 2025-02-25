"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:3000/authenticate", { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          router.push("/login");
        }
        setLoading(false);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-green-600">Dashboard</h1>
      <p className="text-lg text-gray-700 mt-2">Welcome to your Dashboard!</p>
    </div>
  );
}
