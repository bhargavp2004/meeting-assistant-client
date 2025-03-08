"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Video,
  FileText,
  FileSpreadsheet,
  Search
} from "lucide-react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state
  const router = useRouter();

  // Function to fetch meetings
  const fetchMeetings = async (title = "") => {
    try {
      const res = await fetch(
        `http://localhost:3000/media/meetings?title=${encodeURIComponent(title)}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setMeetings(data);
      setLoading(false);
    } catch {
      router.push("/login");
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetch("http://localhost:3000/authenticate", { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          router.push("/login");
        } else {
          fetchMeetings();
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  // Fetch data when search term changes
  useEffect(() => {
    fetchMeetings(searchTerm);
  }, [searchTerm]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search meetings..."
            value={searchTerm} // Controlled input
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Meetings Grid */}
        {meetings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {meeting.title}
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(meeting.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-4">
                  {meeting.recordingurl && (
                    <button
                      className="text-indigo-600 hover:text-indigo-700 flex items-center"
                      onClick={() => router.push(`/meetings/video/${meeting.id}`)}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Recording
                    </button>
                  )}
                  {meeting.transcripturl && (
                    <button
                      className="text-indigo-600 hover:text-indigo-700 flex items-center"
                      onClick={() => router.push(`/meetings/transcription/${meeting.id}`)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Transcript
                    </button>
                  )}
                  {meeting.summarizationurl && (
                    <button className="text-indigo-600 hover:text-indigo-700 flex items-center">
                      <FileSpreadsheet className="h-4 w-4 mr-1" />
                      Summary
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-800">No meetings available.</p>
        )}
      </div>
    </div>
  );
}
