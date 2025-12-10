'use client'

import { useState } from 'react'
import ImageUploader from './components/ImageUploader'
import ResultsDisplay from './components/ResultsDisplay'

export default function Home() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleProcess = async (file: File) => {
    setLoading(true)
    setResults(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erreur lors du traitement')
      }

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors du traitement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen gradient-bg py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            ✨ AI Fashion UGC Generator
          </h1>
          <p className="text-xl text-white/90">
            Transformez vos photos mode en contenu UGC professionnel
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-effect rounded-2xl p-8">
            <ImageUploader onProcess={handleProcess} loading={loading} />
          </div>

          <div className="glass-effect rounded-2xl p-8">
            <ResultsDisplay results={results} loading={loading} />
          </div>
        </div>

        <div className="mt-12 glass-effect rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            🎯 Fonctionnalités
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            <div>
              <h3 className="font-bold mb-2">📸 Amélioration d&apos;image</h3>
              <p className="text-sm text-white/80">
                Upscale 4×, débruitage et correction automatique des couleurs
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">👗 Détection de vêtements</h3>
              <p className="text-sm text-white/80">
                Identification intelligente des articles de mode présents
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">🎬 Vidéo UGC</h3>
              <p className="text-sm text-white/80">
                Création automatique de contenu TikTok/Reels
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
