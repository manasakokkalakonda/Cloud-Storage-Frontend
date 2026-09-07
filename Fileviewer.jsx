import React, { useState } from 'react';

export default function FileViewer({ file }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check file type categories based on mimeType
  const isImage = file?.mimeType?.startsWith('image/');
  const isVideo = file?.mimeType?.startsWith('video/');
  const isPdf = file?.mimeType === 'application/pdf';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Preview Thumbnail / Container */}
      <div 
        className="h-40 bg-slate-50 flex items-center justify-center relative cursor-pointer overflow-hidden group"
        onClick={() => setIsModalOpen(true)}
      >
        {isImage ? (
          <img 
            src={file.signedUrl || file.url} 
            alt={file.name} 
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : isVideo ? (
          <video 
            src={file.signedUrl || file.url} 
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex flex-col items-center text-slate-400 group-hover:text-indigo-600 transition-colors">
            <svg className="w-12 h-12 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium uppercase tracking-wider">{file.mimeType?.split('/')[1] || 'file'}</span>
          </div>
        )}

        {/* Overlay Action on Hover */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/90 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow">
            Preview / View
          </span>
        </div>
      </div>

      {/* File Details */}
      <div className="p-4 flex items-center justify-between">
        <div className="truncate pr-2">
          <h4 className="text-sm font-semibold text-slate-800 truncate" title={file.name}>
            {file.name}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {(file.sizeBytes / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>

        {/* Share Link Button */}
        <button 
          onClick={() => {
            navigator.clipboard.writeText(file.signedUrl || window.location.href);
            alert('Share link copied to clipboard!');
          }}
          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Copy Link"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 12 12c-3-.482-3.114-.938-3.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3.316 3.316 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3.316 3.316 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>

      {/* Fullscreen Preview Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 truncate">{file.name}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl px-2"
              >
                &times;
              </button>
            </div>
            <div className="p-6 flex-auto overflow-auto flex items-center justify-center bg-slate-900/5">
              {isImage ? (
                <img src={file.signedUrl || file.url} alt={file.name} className="max-h-[70vh] object-contain rounded-lg" />
              ) : isVideo ? (
                <video src={file.signedUrl || file.url} controls className="max-h-[70vh] rounded-lg" />
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-600 mb-4">Preview not available for this file format.</p>
                  <a 
                    href={file.signedUrl || file.url} 
                    download 
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}