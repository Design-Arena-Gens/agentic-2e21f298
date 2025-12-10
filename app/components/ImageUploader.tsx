'use client'

import { useState, useCallback } from 'react'

interface ImageUploaderProps {
  onProcess: (file: File) => void
  loading: boolean
}

export default function ImageUploader({ onProcess, loading }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    onProcess(file)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">📤 Upload Image</h2>

      <div
        className={`relative border-4 border-dashed rounded-xl p-8 transition-all ${
          dragActive
            ? 'border-accent bg-white/10'
            : 'border-white/30 hover:border-white/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={loading}
        />

        <div className="text-center">
          {preview ? (
            <div className="space-y-4">
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-lg"
              />
              <p className="text-white/80 text-sm">
                {loading ? '⏳ Traitement en cours...' : '✅ Image chargée'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl">📸</div>
              <p className="text-white text-lg font-medium">
                Glissez une image ici
              </p>
              <p className="text-white/70 text-sm">
                ou cliquez pour sélectionner
              </p>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span className="text-white">Analyse et traitement en cours...</span>
          </div>
        </div>
      )}
    </div>
  )
}
