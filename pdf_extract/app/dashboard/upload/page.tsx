"use client";

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import FileUpload from '@/components/FileUpload';
import SchemaDefinition from '@/components/SchemaDefinition';
import { Progress } from '@/components/ui/progress';
import DataPreview from '@/components/DataPreview';

interface FileWithText extends File {
  extractedText?: string;
}

interface Field {
  id: string;
  name: string;
  type: 'text' | 'number' | 'group';
  description: string;
  fields?: Field[];
}

// Empty initial schema to let users build from scratch
const defaultSchema: Field[] = [];

export default function Home() {
  const [files, setFiles] = useState<FileWithText[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [schema, setSchema] = useState<Field[]>(defaultSchema);
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    toast.success(`Added ${newFiles.length} file(s)`);
  };

  const handleStartExtraction = async () => {
    if (schema.length === 0) {
      toast.error('Please define a data extraction schema first');
      return;
    }

    setProcessing(true);
    setProcessingProgress(0);
    const results: any[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.extractedText) {
          toast.error(`No extracted text found for file: ${file.name}`);
          continue;
        }

        // Update progress before processing each file
        const currentProgress = Math.round((i / files.length) * 100);
        setProcessingProgress(currentProgress);
        
        const response = await fetch('/api/process-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: file.extractedText,
            schema: schema
          }),
        });

        if (!response.ok) {
          throw new Error(`Error processing ${file.name}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Create an array of items from the response
        const items = data[Object.keys(data)[0]].map((_, index) => {
          const item: any = { fileName: file.name };
          for (const field of schema) {
            if (field.type === 'group') {
              item[field.name] = data[field.name] || [];
            } else {
              item[field.name] = data[field.name]?.[index] || null;
            }
          }
          return item;
        });

        results.push(...items);

      }

      // Set progress to 100% only after all files are processed
      setProcessingProgress(100);
      setProcessedData(results);
      toast.success(`Successfully processed ${results.length} file(s)`);
      
    } catch (error) {
      console.error('Error during extraction:', error);
      toast.error('Error during extraction. Please check the console for details.');
    } finally {
      // Keep the progress visible for a moment before resetting
      setTimeout(() => {
        setProcessing(false);
        setProcessingProgress(0);
      }, 500);
    }
  };

  const handleDownloadExcel = async (data: any[]) => {
    setDownloading(true);
    const toastId = toast.loading('Generating Excel file...');
    
    try {
      const response = await fetch('/api/generate-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: data,
          schema: schema
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate Excel file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'extracted_data.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Excel file downloaded successfully', { id: toastId });
    } catch (error) {
      console.error('Error downloading Excel:', error);
      toast.error('Error generating Excel file. Please try again.', { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">PDF Data Extractor</h1>
          <p className="mt-2 text-gray-600">Extract structured data from your PDF files</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">1. Upload PDFs</h2>
            <p className="text-sm text-gray-600">Upload the PDF files you want to process</p>
            <FileUpload onFilesSelected={handleFilesSelected} />
            {files.length > 0 && (
              <div className="text-sm text-gray-600">
                Selected files: {files.map(f => f.name).join(', ')}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">2. Configure Data Extraction Schema</h2>
            <p className="text-sm text-gray-600">Define the structure of the data you want to extract</p>
            <SchemaDefinition schema={schema} onChange={setSchema} />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">3. Extract Data</h2>
            <div className="flex flex-col gap-4">
              <button
                onClick={handleStartExtraction}
                disabled={files.length === 0 || processing || schema.length === 0}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 
                         disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {processing ? 'Processing...' : 'Start Extraction'}
              </button>
　　 　　　　　
              {processing && (
                <div className="space-y-2">
                  <Progress value={processingProgress} />
                  <p className="text-sm text-gray-600 text-center">
                    Processing files... {Math.round(processingProgress)}%
                  </p>
                </div>
              )}

              {processedData.length > 0 && (
                <div className="space-y-4">
                  <DataPreview data={processedData} schema={schema} />
                  <button
                    onClick={() => handleDownloadExcel(processedData)}
                    disabled={downloading}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 
                             disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {downloading ? 'Generating Excel...' : 'Download as Excel'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
