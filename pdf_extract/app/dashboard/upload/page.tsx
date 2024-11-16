'use client'

import { useState } from "react"
import { Upload, File, X } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Progress } from "../../components/ui/progress"

interface UploadedFile {
  name: string
  size: number
  progress: number
}

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

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

  const handleFiles = (files: File[]) => {
    const newFiles = files.map(file => ({
      name: file.name,
      size: file.size,
      progress: 0
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach((file, index) => {
      const interval = setInterval(() => {
        setUploadedFiles(prev => {
          const newState = [...prev]
          const fileIndex = prev.length - newFiles.length + index
          
          if (newState[fileIndex].progress >= 100) {
            clearInterval(interval)
            return prev
          }

          newState[fileIndex] = {
            ...newState[fileIndex],
            progress: Math.min(newState[fileIndex].progress + 10, 100)
          }
          return newState
        })
      }, 500)
    })
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
                key={index}
                className="flex items-center p-4 bg-white rounded-lg border"
              >
                <File className="w-5 h-5 text-primary mr-3" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-2 text-gray-400 hover:text-gray-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <Progress value={file.progress} className="flex-1 mr-4" />
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
