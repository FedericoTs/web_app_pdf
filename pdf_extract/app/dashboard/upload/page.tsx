'use client'

import { useState } from "react"
import { Upload, File, X } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Progress } from "../../components/ui/progress"
import { createClient } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "uuid"

interface UploadedFile {
  id: string
  name: string
  size: number
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  error?: string
}

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const supabase = createClient()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = async (files: File[]) => {
    const newFiles = files.map(file => ({
      id: uuidv4(),
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading' as const
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])

    // Upload each file to Supabase storage
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileData = newFiles[i]

      try {
        // Upload to Supabase storage
        const { data, error } = await supabase.storage
          .from('pdfs')
          .upload(`${fileData.id}/${file.name}`, file, {
            onUploadProgress: (progress) => {
              const percentage = (progress.loaded / progress.total!) * 100
              setUploadedFiles(prev => {
                const newState = [...prev]
                const fileIndex = prev.findIndex(f => f.id === fileData.id)
                if (fileIndex !== -1) {
                  newState[fileIndex] = {
                    ...newState[fileIndex],
                    progress: percentage
                  }
                }
                return newState
              })
            }
          })

        if (error) throw error

        // Create database record
        const { error: dbError } = await supabase
          .from('pdf_documents')
          .insert({
            filename: file.name,
            storage_path: `${fileData.id}/${file.name}`,
            size_bytes: file.size,
            status: 'pending'
          })

        if (dbError) throw dbError

        // Update status to completed
        setUploadedFiles(prev => {
          const newState = [...prev]
          const fileIndex = prev.findIndex(f => f.id === fileData.id)
          if (fileIndex !== -1) {
            newState[fileIndex] = {
              ...newState[fileIndex],
              status: 'completed',
              progress: 100
            }
          }
          return newState
        })
      } catch (error) {
        setUploadedFiles(prev => {
          const newState = [...prev]
          const fileIndex = prev.findIndex(f => f.id === fileData.id)
          if (fileIndex !== -1) {
            newState[fileIndex] = {
              ...newState[fileIndex],
              status: 'error',
              error: error instanceof Error ? error.message : 'Upload failed'
            }
          }
          return newState
        })
      }
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload PDFs</h1>
        <p className="text-muted-foreground">
          Upload your PDF files to extract and process their contents.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? "border-primary bg-primary/5" : "border-gray-200"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium">Drop your files here or</p>
            <label className="relative">
              <span className="text-primary hover:underline cursor-pointer">
                browse
              </span>
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileInput}
                accept=".pdf"
                multiple
              />
            </label>
          </div>
          <p className="text-sm text-muted-foreground">
            Supported file type: PDF
          </p>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Uploaded Files</h2>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={file.id}
                className="flex items-center p-4 bg-white rounded-lg border"
              >
                <File className="w-5 h-5 text-primary mr-3" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      {file.error && (
                        <p className="text-xs text-red-500">{file.error}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {file.status === 'completed' ? 'Completed' : 
                         file.status === 'error' ? 'Error' :
                         file.status === 'processing' ? 'Processing' : 'Uploading'}
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Progress 
                      value={file.progress} 
                      className={`flex-1 mr-4 ${file.status === 'error' ? 'bg-red-100' : ''}`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
