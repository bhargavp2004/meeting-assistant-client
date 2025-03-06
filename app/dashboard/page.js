"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState([]);
  const [isClient, setIsClient] = useState(false); // To ensure the router is mounted
  const router = useRouter();

  // Ensure that useRouter is used only on the client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Don't run if it's not a client-side render
    fetch("http://localhost:3000/authenticate", { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          router.push("/login");
        }
        return fetch("http://localhost:3000/media/meetings", { credentials: "include" });
      })
      .then((res) => res.json())
      .then((data) => {
        setMeetings(data);
        setLoading(false);
      })
      .catch(() => router.push("/login"));
  }, [router, isClient]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-800">{meeting.title}</h2>
            <p className="text-gray-600 mt-2">{meeting.date}</p>
            <p className="text-gray-600 mt-2">{meeting.summary}</p>
            <div className="mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => router.push(`/meetings/video/${meeting.id}`)}
              >
                Watch Video
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => router.push(`/meetings/transcription/${meeting.id}`)}
              >
                View Transcription
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
