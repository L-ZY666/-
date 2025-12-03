import React, { useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;
      
      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith('.docx') || file.name.endsWith('.doc'))) {
        onFileSelect(file);
      } else {
        alert("Please upload a .docx file");
      }
    },
    [onFileSelect, disabled]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed border-slate-300 bg-slate-100' : 'border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer bg-white'}
      `}
    >
      <input
        type="file"
        accept=".docx,.doc"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`p-4 rounded-full ${disabled ? 'bg-slate-200' : 'bg-emerald-100 text-emerald-600'}`}>
          <Upload size={32} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Click to upload or drag & drop
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Word Documents (.docx) only. Max size 10MB.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
