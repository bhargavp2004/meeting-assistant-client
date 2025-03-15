"use client";
import React, { useState } from "react";
import {
    Upload,
    Loader2,
    CheckCircle,
    FileText,
    FileSpreadsheet,
    AlertCircle,
} from "lucide-react";

const apiKey = "2213644e87ed41239eaa2a4ad8824bd4";

const UploadPage = () => {
    const [uploadStatus, setUploadStatus] = useState("idle");
    const [file, setFile] = useState(null);
    const [analysisResults, setAnalysisResults] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleTranscription = async () => {
        if (!file) {
            alert("Please upload an audio file.");
            return;
        }

        setUploadStatus("processing");

        try {
            // Upload file to AssemblyAI
            const uploadResponse = await fetch("https://api.assemblyai.com/v2/upload", {
                method: "POST",
                headers: {
                    Authorization: apiKey,
                },
                body: file,
            });

            if (!uploadResponse.ok) {
                throw new Error("File upload failed");
            }

            const uploadData = await uploadResponse.json();
            const audioUrl = uploadData.upload_url;

            // Call AssemblyAI to transcribe and summarize
            const transcriptResponse = await fetch("https://api.assemblyai.com/v2/transcript", {
                method: "POST",
                headers: {
                    Authorization: apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    audio_url: audioUrl,
                    speaker_labels: true,
                    summarization: true,
                    summary_model: "informative",
                    summary_type: "bullets",
                }),
            });

            if (!transcriptResponse.ok) {
                throw new Error("Transcription request failed");
            }

            const transcriptData = await transcriptResponse.json();
            const transcriptId = transcriptData.id;

            // Poll for transcript completion
            let transcriptStatus = "queued";
            let transcriptResult;

            while (transcriptStatus !== "completed") {
                const checkResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
                    method: "GET",
                    headers: { Authorization: apiKey },
                });

                if (!checkResponse.ok) {
                    throw new Error("Failed to fetch transcript");
                }

                transcriptResult = await checkResponse.json();
                transcriptStatus = transcriptResult.status;

                if (transcriptStatus === "failed") {
                    throw new Error("Transcription failed");
                }

                if (transcriptStatus !== "completed") {
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                }
            }

            if (transcriptResult.utterances) {
                const labeledTranscript = transcriptResult.utterances
                    .map((u) => `Speaker ${u.speaker}: ${u.text}`)
                    .join("\n");

                setAnalysisResults({
                    transcript: labeledTranscript,
                    summary: transcriptResult.summary,
                });
            } else {
                setAnalysisResults({
                    transcript: transcriptResult.text, // Fallback to regular text if no utterances are found
                    summary: transcriptResult.summary,
                });
            }

            setUploadStatus("success");
        } catch (error) {
            console.error("Error:", error);
            setUploadStatus("error");
        }
    };

    const handleClear = () => {
        setUploadStatus("idle");
        setFile(null);
        setAnalysisResults(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Transcribe and Summarization of File</h1>

                    {uploadStatus === "idle" && (
                        <div className="text-center">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Audio/Video File</h3>
                            <p className="text-sm text-gray-500 mb-4">Select an audio or video file to transcribe.</p>
                            <label className="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-md shadow-sm hover:bg-indigo-700 transition inline-block">
                                Choose File
                                <input
                                    type="file"
                                    accept="audio/*,video/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                            {file && <p className="mt-2 text-sm text-gray-700">{file.name}</p>}
                            <div className="mt-4 flex flex-col items-center space-y-4">
                                <button
                                    onClick={handleTranscription}
                                    className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Transcribe & Summarize
                                </button>
                            </div>
                        </div>
                    )}

                    {uploadStatus === "processing" && (
                        <div className="text-center py-12">
                            <Loader2 className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-spin" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Processing your recording...</h3>
                            <p className="text-sm text-gray-500">This may take a few minutes...</p>
                        </div>
                    )}

                    {uploadStatus === "success" && analysisResults && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center align-middle text-green-500">
                                    <CheckCircle className="h-12 w-12" />
                                    <span className="ml-3 text-lg font-medium">Processing Complete!</span>
                                </div>
                                <button
                                    onClick={handleClear}
                                    className="px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                                >
                                    Clear
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Transcript Section */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="flex items-center mb-4">
                                        <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                                        <h2 className="text-xl font-semibold text-gray-900">Transcript</h2>
                                    </div>
                                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 max-h-[400px] overflow-y-auto">
                                        {analysisResults.transcript}
                                    </pre>
                                </div>

                                {/* Summary Section */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="flex items-center mb-4">
                                        <FileSpreadsheet className="h-5 w-5 text-indigo-600 mr-2" />
                                        <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
                                    </div>
                                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 max-h-[400px] overflow-y-auto">
                                        {analysisResults.summary}
                                    </pre>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default UploadPage;
