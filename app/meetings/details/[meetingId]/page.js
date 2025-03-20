"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Calendar, Video, Users } from "lucide-react";
import translate from "translate";

translate.engine = "google";

export default function MeetingDetailsPage() {
  const downloadFile = (content, fileName) => {
    try {
      const blob = new Blob([content], { type: "text/plain" });
      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download the file.");
    }
  };

  const router = useRouter();
  const params = useParams();
  const meetingId = params.meetingId;

  const [loading, setLoading] = useState(true);
  const [meeting, setMeeting] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [accessList, setAccessList] = useState([]);
  const [activeTab, setActiveTab] = useState("transcript");
  const [transcriptContent, setTranscriptContent] = useState(null);
  const [summaryContent, setSummaryContent] = useState(null);

  useEffect(() => {
    if (!meetingId) return;

    // Fetch meeting details
    fetch(`http://localhost:3000/media/meetings/${meetingId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(async (data) => {
        setMeeting(data.meeting);
        setAccessList(data.accessList);

        if (data.meeting.transcripturl) {
          await fetchTranscriptContent(data.meeting.transcripturl);
        }
        if (data.meeting.summarizationurl) {
          await fetchSummaryContent(data.meeting.summarizationurl);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching meeting details:", error);
        setLoading(false);
      });
  }, [meetingId]);

  // Fetch and translate transcript content
  const fetchTranscriptContent = async (url) => {
    try {
      const response = await fetch(url);
      const content = await response.text();
      translateContent(content, setTranscriptContent);
    } catch (error) {
      console.error("Error fetching transcript content:", error);
      setTranscriptContent("Failed to load transcript.");
    }
  };

  // Fetch and translate summary content
  const fetchSummaryContent = async (url) => {
    try {
      const response = await fetch(url);
      const content = await response.text();
      translateContent(content, setSummaryContent);
    } catch (error) {
      console.error("Error fetching summary content:", error);
      setSummaryContent("Failed to load summary.");
    }
  };

  // Translate content dynamically
  const translateContent = async (content, setContent) => {
    if (selectedLanguage === "en") {
      setContent(content);
    } else {
      try {
        const result = await translate(content, {to: selectedLanguage});
        console.log(result);
        setContent(result);
      } catch (error) {
        console.error("Error translating content:", error);
        setContent("Failed to translate content.");
      }
    }
  };

  // Re-fetch and translate when language changes
  useEffect(() => {
    if (meeting?.transcripturl) {
      fetchTranscriptContent(meeting.transcripturl);
    }
    if (meeting?.summarizationurl) {
      fetchSummaryContent(meeting.summarizationurl);
    }
  }, [selectedLanguage]);

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-10">
        Loading meeting details...
      </p>
    );
  if (!meeting)
    return (
      <p className="text-center text-gray-600 mt-10">Meeting not found.</p>
    );

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
          <h1 className="text-2xl font-semibold text-gray-900">
            {meeting.title}
          </h1>
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
              <h2 className="text-xl font-semibold text-gray-900">
                Meeting Recording
              </h2>
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
              <h2 className="text-xl font-semibold text-gray-900">
                Users with Access
              </h2>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {accessList && accessList.length > 0 ? (
                accessList.map(({ email }, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 border rounded-lg bg-gray-50"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-indigo-200 text-indigo-600 rounded-full font-semibold mr-3">
                      {email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">{email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">
                  No users have access to this meeting.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Transcript & Summary Tabs */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          {/* Language Dropdown */}
          <div className="mb-4">
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700"
            >
              Select Language
            </label>
            <select
              id="language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 text-black rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="gu">Gujarat</option>
            </select>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`w-1/2 py-2 text-center border-b-2 font-semibold ${
                activeTab === "transcript"
                  ? "border-indigo-600 text-indigo-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("transcript")}
            >
              Transcript
            </button>
            <button
              className={`w-1/2 py-2 text-center border-b-2 font-semibold ${
                activeTab === "summary"
                  ? "border-indigo-600 text-indigo-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("summary")}
            >
              Summary
            </button>
          </div>

          {/* Content Section */}
          <div className="bg-gray-50 rounded-lg p-4 max-h-[400px] overflow-y-auto mt-4">
            {activeTab === "transcript" ? (
              transcriptContent ? (
                <pre className="text-gray-700 whitespace-pre-wrap">
                  {transcriptContent}
                </pre>
              ) : (
                <p className="text-gray-600">No transcript available</p>
              )
            ) : summaryContent ? (
              <pre className="text-gray-700 whitespace-pre-wrap">
                {summaryContent}
              </pre>
            ) : (
              <p className="text-gray-600">No summary available</p>
            )}
          </div>

          {/* Download Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() =>
                downloadFile(transcriptContent, "transcript.txt")
              }
              disabled={!transcriptContent}
              className={`${
                transcriptContent
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-400"
              } text-white px-4 py-2 rounded-lg`}
            >
              Download Transcript
            </button>
            <button
              onClick={() => downloadFile(summaryContent, "summary.txt")}
              disabled={!summaryContent}
              className={`${
                summaryContent
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-400"
              } text-white px-4 py-2 rounded-lg`}
            >
              Download Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
