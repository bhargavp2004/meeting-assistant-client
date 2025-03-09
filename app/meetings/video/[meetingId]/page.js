"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function VideoPage() {
  const router = useRouter();
  const params = useParams(); // Get meetingId from the URL
  const meetingId = params.meetingId; // Extract meetingId from params

  console.log("Meeting ID from URL params:", meetingId);

  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    if (!meetingId) return;

    console.log("Fetching video for meetingId:", meetingId);

    fetch(`http://localhost:3000/media/meetings/${meetingId}/video`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("Video data received:", data);
        setVideoUrl(data.videoUrl);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching video:", error);
        router.push("/login");
      });
  }, [meetingId, router]);

  if (!meetingId) return <p>Loading...</p>;
  if (loading) return <p>Loading video...</p>;
  if (!videoUrl) return <p>No video available</p>;

  return (
    <div className="container mx-auto p-4 mt-5">
      <h2 className="text-2xl font-semibold mb-4 text-black">Meeting Video</h2>
      <video controls className="w-full">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
