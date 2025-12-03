import React from 'react';
import { ReviewResponse, CommentSeverity } from '../types';
import ScoreChart from './ScoreChart';
import { CheckCircle2, AlertTriangle, XCircle, Download, FileText, User } from 'lucide-react';

interface ReviewDashboardProps {
  data: ReviewResponse;
  fileName: string;
}

const ReviewDashboard: React.FC<ReviewDashboardProps> = ({ data, fileName }) => {
  
  const getSeverityIcon = (severity: CommentSeverity) => {
    switch (severity) {
      case CommentSeverity.CRITICAL:
        return <XCircle className="text-red-500 mt-1 flex-shrink-0" size={20} />;
      case CommentSeverity.MINOR:
        return <AlertTriangle className="text-amber-500 mt-1 flex-shrink-0" size={20} />;
      case CommentSeverity.GOOD:
        return <CheckCircle2 className="text-emerald-500 mt-1 flex-shrink-0" size={20} />;
    }
  };

  const getSeverityClass = (severity: CommentSeverity) => {
    switch (severity) {
      case CommentSeverity.CRITICAL:
        return "border-l-4 border-l-red-500 bg-red-50";
      case CommentSeverity.MINOR:
        return "border-l-4 border-l-amber-500 bg-amber-50";
      case CommentSeverity.GOOD:
        return "border-l-4 border-l-emerald-500 bg-emerald-50";
    }
  };

  const handleDownloadReport = () => {
    const reportContent = `
REVIEW REPORT FOR: ${fileName}
REVIEWER: AI Agronomy Professor
DATE: ${new Date().toLocaleDateString()}

--- EXECUTIVE SUMMARY ---
${data.summary}

--- SCORES ---
Logic: ${data.scores.logic}/100
Content: ${data.scores.content}/100
Structure: ${data.scores.structure}/100
Feasibility: ${data.scores.feasibility}/100
Scientific Rigor: ${data.scores.scientific}/100

--- DETAILED COMMENTS ---
${data.comments.map((c, i) => `
[${i + 1}] SEVERITY: ${c.severity.toUpperCase()}
CONTEXT: "${c.original_text_context}"
CRITIQUE: ${c.critique}
SUGGESTION: ${c.suggestion}
`).join('\n')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Review_Report_${fileName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
           <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-1">
              <User size={18} />
              <span>Supervisor's Assessment</span>
           </div>
           <h2 className="text-2xl font-bold text-slate-800">Review for: {fileName}</h2>
        </div>
        <button 
          onClick={handleDownloadReport}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <Download size={16} />
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Summary & Stats */}
        <div className="space-y-6">
          <ScoreChart scores={data.scores} />
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-slate-500" />
              Executive Summary
            </h3>
            <div className="prose prose-sm prose-slate text-slate-600 leading-relaxed">
              {data.summary}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Comments */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Detailed Feedback</h3>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                {data.comments.length} Comments
              </span>
           </div>

           <div className="space-y-4">
             {data.comments.map((comment, index) => (
               <div 
                  key={index} 
                  className={`p-5 rounded-lg border border-slate-200 shadow-sm transition-all hover:shadow-md ${getSeverityClass(comment.severity)}`}
               >
                 <div className="flex items-start gap-4">
                   {getSeverityIcon(comment.severity)}
                   <div className="flex-1 space-y-3">
                      <div className="bg-white/60 p-3 rounded border border-black/5">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Original Text Reference</p>
                        <p className="font-serif italic text-slate-700 text-sm">"{comment.original_text_context}"</p>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-slate-800 mb-1">Critique</p>
                        <p className="text-slate-700 text-sm leading-relaxed">{comment.critique}</p>
                      </div>

                      <div className="pt-2 border-t border-black/5">
                         <p className="font-semibold text-emerald-700 text-sm mb-1">Supervisor's Suggestion</p>
                         <p className="text-emerald-800 text-sm">{comment.suggestion}</p>
                      </div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDashboard;
