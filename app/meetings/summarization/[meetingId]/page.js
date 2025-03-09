"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function SummarizationPage() {
    const router = useRouter();
    const params = useParams(); // Get meetingId from the URL
    const meetingId = params.meetingId; // Extract meetingId from params

    console.log("Meeting ID from URL params:", meetingId);

    const [loading, setLoading] = useState(true);
    const [summarizationUrl, setSummarizationUrl] = useState(null);

    useEffect(() => {
        if (!meetingId) return;

        console.log("Fetching summarization for meetingId:", meetingId);

        fetch(`http://localhost:3000/media/meetings/${meetingId}/summarization`, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                console.log("Summarization data received:", data);
                setSummarizationUrl(data.summarizationUrl);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching summarization:", error);
                router.push("/login");
            });
    }, [meetingId, router]);

    if (!meetingId) return <p>Loading...</p>;
    if (loading) return <p>Loading summarization...</p>;
    if (!summarizationUrl) return <p>No summarization available</p>;

    return (
        <div className="container mx-auto p-4 mt-5">
            <h2 className="text-2xl font-semibold mb-4 text-black">Meeting Summarization</h2>
            <iframe src={summarizationUrl} className="w-full h-screen" title="Summarization"></iframe>
        </div>
    );
}
