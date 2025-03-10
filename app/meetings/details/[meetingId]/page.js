"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Calendar, Video, Users } from "lucide-react";

export default function MeetingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const meetingId = params.meetingId;

  const [loading, setLoading] = useState(true);
  const [meeting, setMeeting] = useState(null);
  const [accessList, setAccessList] = useState([]);
  const [activeTab, setActiveTab] = useState("transcript");

  useEffect(() => {
    if (!meetingId) return;

    // Fetch meeting details
    fetch(`http://localhost:3000/media/meetings/${meetingId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setMeeting(data.meeting);
        setAccessList(data.accessList);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching meeting details:", error);
        setLoading(false);
      });
  }, [meetingId]);

  if (loading) return <p className="text-center text-gray-600 mt-10">Loading meeting details...</p>;
  if (!meeting) return <p className="text-center text-gray-600 mt-10">Meeting not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6 pt-20">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Dashboard
        </button>

        {/* Meeting Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{meeting.title}</h1>
          <div className="flex items-center text-gray-600 mt-2">
            <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
            <p>Created on {new Date(meeting.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Meeting Video */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Video className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Meeting Recording</h2>
            </div>
            {meeting.recordingurl ? (
              <video controls className="w-full rounded-lg shadow-sm">
                <source src={meeting.recordingurl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p className="text-gray-600">No recording available</p>
            )}
          </div>

          {/* Users with Access */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Users className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Users with Access</h2>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {accessList && accessList.length > 0 ? (
                accessList.map((user, index) => (
                  <div key={index} className="flex items-center p-2 border rounded-lg bg-gray-50">
                    <div className="w-8 h-8 flex items-center justify-center bg-indigo-200 text-indigo-600 rounded-full font-semibold mr-3">
                      {user.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">{user}</p>
                      {/* <p className="text-gray-600 text-sm">{user.email}</p> */}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No users have access to this meeting.</p>
              )}
            </div>
          </div>
        </div>

        {/* Transcript & Summary Tabs */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex border-b">
            <button
              className={`w-1/2 py-2 text-center border-b-2 font-semibold ${
                activeTab === "transcript" ? "border-indigo-600 text-indigo-600" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("transcript")}
            >
              Transcript
            </button>
            <button
              className={`w-1/2 py-2 text-center border-b-2 font-semibold ${
                activeTab === "summary" ? "border-indigo-600 text-indigo-600" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("summary")}
            >
              Summary
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 max-h-[400px] overflow-y-auto mt-4">
            {activeTab === "transcript" ? (
              meeting.transcripturl ? (
                <iframe src={meeting.transcripturl} className="w-full h-96" title="Transcription"></iframe>
              ) : (
                <p className="text-gray-600">No transcription available</p>
              )
            ) : meeting.summarizationurl ? (
              <iframe src={meeting.summarizationurl} className="w-full h-96" title="Summarization"></iframe>
            ) : (
              <p className="text-gray-600">No summarization available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
