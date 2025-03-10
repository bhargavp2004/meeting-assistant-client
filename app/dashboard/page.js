"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Eye, Pencil, Trash, Search } from "lucide-react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editMeeting, setEditMeeting] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [deleteMeetingId, setDeleteMeetingId] = useState(null); // Track meeting to delete
  const router = useRouter();

  // Fetch meetings
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

  useEffect(() => {
    fetchMeetings(searchTerm);
  }, [searchTerm]);

  const openEditModal = (meeting) => {
    setEditMeeting(meeting);
    setNewTitle(meeting.title);
  };

  const closeEditModal = () => {
    setEditMeeting(null);
    setNewTitle("");
  };

  const handleSaveEdit = async () => {
    if (!editMeeting) return;

    try {
      const res = await fetch(`http://localhost:3000/media/meetings/${editMeeting.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
        credentials: "include",
      });

      if (res.ok) {
        setMeetings((prevMeetings) =>
          prevMeetings.map((m) => (m.id === editMeeting.id ? { ...m, title: newTitle } : m))
        );
        closeEditModal();
      }
    } catch (error) {
      console.error("Error updating meeting:", error);
    }
  };

  const confirmDelete = async () => {
    if (!deleteMeetingId) return;

    try {
      const res = await fetch(`http://localhost:3000/media/meetings/${deleteMeetingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setMeetings((prevMeetings) => prevMeetings.filter((m) => m.id !== deleteMeetingId));
      } else {
        console.error("Failed to delete meeting");
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
    } finally {
      setDeleteMeetingId(null);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search meetings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {meetings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{meeting.title}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(meeting.createdAt).toLocaleDateString()}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-4">
                  <button
                    className="text-indigo-600 hover:text-indigo-700 flex items-center"
                    onClick={() => router.push(`/meetings/details/${meeting.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> View
                  </button>
                  <button
                    className="text-green-600 hover:text-green-700 flex items-center"
                    onClick={() => openEditModal(meeting)}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-700 flex items-center"
                    onClick={() => setDeleteMeetingId(meeting.id)}
                  >
                    <Trash className="h-4 w-4 mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-800">No meetings available.</p>
        )}
      </div>

      {/* Edit Modal */}
      {editMeeting && (
        <div className="fixed inset-0 flex text-gray-900 items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Meeting Title</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={closeEditModal} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={handleSaveEdit} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteMeetingId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg text-black mt-3 font-bold mb-4">Confirm Deletion</h2>
            <p className="text-gray-700">Are you sure you want to delete this meeting?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={() => setDeleteMeetingId(null)} className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
