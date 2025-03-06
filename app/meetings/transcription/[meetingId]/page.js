"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function TranscriptionPage() {
    const router = useRouter();
    const params = useParams(); // Get meetingId from the URL
    const meetingId = params.meetingId; // Extract meetingId from params

    console.log("Meeting ID from URL params:", meetingId);

    const [loading, setLoading] = useState(true);
    const [transcriptionUrl, setTranscriptionUrl] = useState(null);

    useEffect(() => {
        if (!meetingId) return;

        console.log("Fetching transcription for meetingId:", meetingId);

        fetch(`http://localhost:3000/media/meetings/${meetingId}/transcription`, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                console.log("Transcription data received:", data);
                setTranscriptionUrl(data.transcriptionUrl);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching transcription:", error);
                router.push("/login");
            });
    }, [meetingId, router]);

    if (!meetingId) return <p>Loading...</p>;
    if (loading) return <p>Loading transcription...</p>;
    if (!transcriptionUrl) return <p>No transcription available</p>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4 text-black">Meeting Transcription</h2>
            <iframe src={transcriptionUrl} className="w-full h-screen" title="Transcription"></iframe>
        </div>
    );
}
