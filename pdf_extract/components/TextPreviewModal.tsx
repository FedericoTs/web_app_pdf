'use client';

import { X } from 'lucide-react';

interface TextPreviewModalProps {
  text: string;
  fileName: string;
  onClose: () => void;
}

export default function TextPreviewModal({ text, fileName, onClose }: TextPreviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Extracted Text - {fileName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
            {text}
          </pre>
        </div>
      </div>
    </div>
  );
}
