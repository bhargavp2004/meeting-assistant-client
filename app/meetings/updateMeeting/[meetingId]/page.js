"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, Mail, X, Plus } from "react-feather";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const MeetingUpdationPage = () => {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const meetingId = params.meetingId;
    const [meeting, setMeeting] = useState(null);
    const [title, setTitle] = useState(searchParams.get("meetingTitle") || "");
    const [emailInputs, setEmailInputs] = useState([""]);
    const [currentAccessList, setCurrentAccessList] = useState([]);
    const [accessList, setAccessList] = useState([]);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/media/meetings/${meetingId}`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                setMeeting(data.meeting);
                setAccessList(data.accessList);
                // const tempAccessList = data.accessList;
                // setEmailInputs(tempAccessList.map(({ email }) => email));
            })
            .catch((error) => {
                console.error("Error fetching meeting details:", error);
            });
    }, [meetingId]);

    const handleAddEmailInput = () => {
        setEmailInputs([...emailInputs, ""]);
    };

    const handleEmailChange = (index, value) => {
        const updatedInputs = [...emailInputs];
        updatedInputs[index] = value;
        setEmailInputs(updatedInputs);
    };

    const handleRemoveEmailInput = (index) => {
        setEmailInputs(emailInputs.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        const validEmails = emailInputs.filter(email => email.trim() !== ""); // Filter out empty inputs
        const data = [...validEmails, ...accessList.map(({ email }) => email)];

        if (data.length === 0) {
            setErrors(["Please enter at least one email address."]);
            return;
        }

        fetch(`http://localhost:3000/media/meetings/${meetingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                accessList: data,
                meetingId: meetingId,
                title: title,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    toast.error("Meeting updation failed : ", data.error);
                } else {
                    const emailsToAdd = validEmails.map((email) => ({ username: "", email: email }));
                    setAccessList([...accessList, ...emailsToAdd]);
                    setEmailInputs([""]); // Reset input fields
                    setErrors([]);
                    toast.success("Meeting updated successfully!");
                    router.push('/dashboard')
                    // router.push(`/meetings/meetingAccess/${meetingId}`)
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    if (!meeting) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
                {/* Back Button */}
                <button
                    onClick={() => router.push(`/dashboard`)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-lg shadow-md p-6 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Title
                    </h1>
                    <div className="flex-grow">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter Title"
                            className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Manage Access
                        </h1>
                        <p className="text-gray-600">
                            Control who has access to "{meeting.title}"
                        </p>
                    </div>

                    {/* Current Access List */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Current Access
                        </h2>
                        <div className="space-y-3">
                            {accessList.map(({ email, username }, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                                >
                                    <div className="flex items-center">
                                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="text-gray-700">{email}</span>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setAccessList(accessList.filter((_, i) => i !== index))
                                        }
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {errors && errors.length > 0 &&
                            <div>
                                {errors.map((error, index) => (
                                    <d key={index} className="text-red-500">{error}</d>
                                ))}
                            </div>}
                    </div>

                    {/* Add New Access */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Add New Access
                        </h2>

                        {emailInputs.map((email, index) => (
                            <div key={index} className="flex gap-3 mb-2">
                                <div className="flex-grow">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => handleEmailChange(index, e.target.value)}
                                        placeholder="Enter email address"
                                        className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <button
                                    onClick={() => handleRemoveEmailInput(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={handleAddEmailInput}
                            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <Plus className="h-5 w-5 mr-1" />
                            Add Another Email
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeetingUpdationPage;
