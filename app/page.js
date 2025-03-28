"use client";
import { Brain, Video, FileText, BrainCircuit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "./components/AuthProvider";

const Home = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        {/* Hero Section */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Transform Your Meetings with
          <span className="text-indigo-600"> AI Intelligence</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Automatically record, transcribe, and summarize your meetings. Get insights and action items without the manual work.
        </p>
        <div className="flex justify-center space-x-4 mb-12">
          <button
            onClick={() => { if (isAuthenticated) { router.push('/dashboard') } else { router.push("/register") } }}
            className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-3 rounded-lg text-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Get Started
          </button>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <Video className="h-10 w-10 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Automatic Recording
            </h3>
            <p className="text-gray-600">
              Never miss a detail with automatic meeting recordings, stored in the cloud.
            </p>
          </div>
          {/* Feature Card 2 */}
          <div className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <FileText className="h-10 w-10 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Smart Transcription
            </h3>
            <p className="text-gray-600">
              Get accurate transcripts powered by advanced AI.
            </p>
          </div>
          {/* Feature Card 3 */}
          <div className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <Brain className="h-10 w-10 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              AI Summaries
            </h3>
            <p className="text-gray-600">
              Receive concise, intelligent summaries with key points and action items.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
