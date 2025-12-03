import React, { useState } from 'react';
import { Sprout, FileUp, Loader2, AlertCircle } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ReviewDashboard from './components/ReviewDashboard';
import { AppState, ReviewResponse } from './types';
import { extractTextFromDocx } from './utils/docxHelper';
import { reviewDocument } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [reviewData, setReviewData] = useState<ReviewResponse | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFileSelect = async (file: File) => {
    setCurrentFile(file);
    setAppState(AppState.PARSING);
    setErrorMessage("");

    try {
      // 1. Extract Text
      const text = await extractTextFromDocx(file);
      
      if (!text || text.length < 50) {
        throw new Error("The document appears to be empty or unreadable.");
      }

      setAppState(AppState.ANALYZING);

      // 2. Send to Gemini
      const result = await reviewDocument(text);
      setReviewData(result);
      setAppState(AppState.COMPLETE);

    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "An unexpected error occurred during processing.");
      setAppState(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setAppState(AppState.IDLE);
    setReviewData(null);
    setCurrentFile(null);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetApp}>
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Sprout className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">AgriReview</span>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            AI-Powered Academic Supervision
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* IDLE STATE: Intro & Upload */}
          {appState === AppState.IDLE && (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold text-slate-900 font-serif">
                  Your Personal PhD Supervisor
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Upload your experiment proposal, thesis chapter, or lab report. 
                  I will review it for logic, scientific rigor, feasibility, and structure.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <FileUpload onFileSelect={handleFileSelect} />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center text-sm text-slate-500">
                <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <span className="font-bold text-slate-800 block mb-1">Scientific Rigor</span>
                  Checks statistical logic
                </div>
                <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <span className="font-bold text-slate-800 block mb-1">Feasibility</span>
                  Validates methods
                </div>
                <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <span className="font-bold text-slate-800 block mb-1">Structure</span>
                  Academic formatting
                </div>
              </div>
            </div>
          )}

          {/* LOADING STATES */}
          {(appState === AppState.PARSING || appState === AppState.ANALYZING) && (
             <div className="flex flex-col items-center justify-center py-20 space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping"></div>
                  <div className="relative bg-white p-4 rounded-full shadow-lg border border-emerald-100">
                    <Loader2 className="animate-spin text-emerald-600" size={48} />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-slate-800">
                    {appState === AppState.PARSING ? 'Reading Document...' : 'Professor is Reviewing...'}
                  </h3>
                  <p className="text-slate-500">
                    {appState === AppState.PARSING 
                      ? 'Extracting content from your .docx file' 
                      : 'Analyzing logic, feasibility, and scientific content'}
                  </p>
                </div>
             </div>
          )}

          {/* ERROR STATE */}
          {appState === AppState.ERROR && (
            <div className="max-w-xl mx-auto bg-white p-8 rounded-xl border border-red-100 shadow-sm text-center space-y-6">
              <div className="inline-flex bg-red-50 p-3 rounded-full text-red-500">
                <AlertCircle size={40} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Review Failed</h3>
                <p className="text-slate-600 mt-2">{errorMessage}</p>
              </div>
              <button 
                onClick={resetApp}
                className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* RESULTS STATE */}
          {appState === AppState.COMPLETE && reviewData && (
            <ReviewDashboard data={reviewData} fileName={currentFile?.name || "Document"} />
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
