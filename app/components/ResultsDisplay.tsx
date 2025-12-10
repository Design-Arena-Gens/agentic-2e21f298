'use client'

interface ResultsDisplayProps {
  results: any
  loading: boolean
}

export default function ResultsDisplay({ results, loading }: ResultsDisplayProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">⚡ Résultats</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto"></div>
            <p className="text-white">Traitement magique en cours...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">⚡ Résultats</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="text-6xl">✨</div>
            <p className="text-white/70">
              Les résultats apparaîtront ici
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">⚡ Résultats</h2>

      {results.enhancedImage && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">📸 Image Améliorée</h3>
          <img
            src={results.enhancedImage}
            alt="Enhanced"
            className="w-full rounded-lg shadow-xl"
          />
          <a
            href={results.enhancedImage}
            download="enhanced-image.png"
            className="block w-full bg-accent text-center py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            ⬇️ Télécharger l&apos;image
          </a>
        </div>
      )}

      {results.detectedItems && results.detectedItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">👗 Vêtements Détectés</h3>
          <div className="bg-white/10 rounded-lg p-4">
            <ul className="space-y-2 text-white">
              {results.detectedItems.map((item: string, idx: number) => (
                <li key={idx} className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {results.ugcVideo && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">🎬 Vidéo UGC</h3>
          <video
            src={results.ugcVideo}
            controls
            className="w-full rounded-lg shadow-xl"
          >
            Votre navigateur ne supporte pas la vidéo.
          </video>
          <a
            href={results.ugcVideo}
            download="ugc-video.mp4"
            className="block w-full bg-primary text-white text-center py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            ⬇️ Télécharger la vidéo
          </a>
        </div>
      )}

      {results.description && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">💬 Description</h3>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-white/90 text-sm">{results.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}
