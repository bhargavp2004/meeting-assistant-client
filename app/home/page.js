"use client";
import { Brain, Video, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

const HomePage = () => {
    const router = useRouter();
    return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="pt-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Your Meetings with
              <span className="text-indigo-600"> AI Intelligence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Automatically record, transcribe, and summarize your meetings. Get insights and action items without the manual work.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push('/register')}
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-3 rounded-lg text-lg font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Free
              </button>
              <button className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-3 rounded-lg text-lg font-medium shadow-lg hover:shadow-xl transition-all">
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Everything you need for smarter meetings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <Video className="h-10 w-10 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Automatic Recording
                </h3>
                <p className="text-gray-600">
                  Never miss a detail with automatic meeting recordings, stored securely in the cloud.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <FileText className="h-10 w-10 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Smart Transcription
                </h3>
                <p className="text-gray-600">
                  Get accurate transcripts powered by advanced AI, with speaker detection.
                </p>
              </div>
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

        {/* Stats Section */}
        <div className="bg-indigo-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">50%</div>
                <div className="text-indigo-100">Time Saved</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">10,000+</div>
                <div className="text-indigo-100">Meetings Analyzed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">98%</div>
                <div className="text-indigo-100">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}

  export default HomePage;