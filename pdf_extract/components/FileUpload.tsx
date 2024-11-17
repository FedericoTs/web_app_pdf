'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File } from 'lucide-react';
import TextPreviewModal from './TextPreviewModal';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
}

type FileWithText = File & { extractedText?: string };

export default function FileUpload({ onFilesSelected }: FileUploadProps) {
  const [files, setFiles] = useState<FileWithText[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [previewFile, setPreviewFile] = useState<FileWithText | null>(null);

  const extractText = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract text');
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error extracting text:', error);
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = [...acceptedFiles];
    setFiles(prev => [...prev, ...newFiles]);
    onFilesSelected(newFiles);

    // Process each file for text extraction
    for (const file of newFiles) {
      setLoading(prev => ({ ...prev, [file.name]: true }));
      try {
        const extractedText = await extractText(file);
        setFiles(prev => 
          prev.map(f => 
            f.name === file.name 
              ? Object.assign(f, { extractedText }) 
              : f
          )
        );
      } catch (error) {
        console.error(`Failed to extract text from ${file.name}:`, error);
      } finally {
        setLoading(prev => ({ ...prev, [file.name]: false }));
      }
    }
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-indigo-500" />
        <p className="mt-4 text-base text-gray-600">
          {isDragActive
            ? 'Drop your PDF files here...'
            : 'Drag & drop your PDF files here, or click to browse'}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Support for multiple PDF files
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Files</h3>
          <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden bg-white">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between py-4 px-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center min-w-0 flex-1">
                  <File className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                  <span className="ml-3 truncate text-gray-700">{file.name}</span>
                  {loading[file.name] && (
                    <span className="ml-3 text-sm text-gray-500">Extracting text...</span>
                  )}
                </div>
                <div className="flex items-center ml-4">
                  <span className="text-sm text-gray-500 flex-shrink-0 mr-4">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  {file.extractedText && (
                    <button
                      onClick={() => setPreviewFile(file)}
                      className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      Preview Text
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {previewFile && previewFile.extractedText && (
        <TextPreviewModal
          text={previewFile.extractedText}
          fileName={previewFile.name}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}
