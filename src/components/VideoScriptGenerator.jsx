import { useState } from 'react'
import { Video, Loader2 } from 'lucide-react'

const PLATFORMS = [
  {
    id: 'tiktok',
    name: 'TikTok',
    duration: '5-9s or 60s+',
    description: 'Bold, attention-grabbing micro-storytelling',
    icon: '🎵'
  },
  {
    id: 'instagram',
    name: 'Instagram Reels',
    duration: '15-60s',
    description: 'Visual storytelling with beautiful aesthetics',
    icon: '📸'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    duration: '60s-10min+',
    description: 'In-depth, educational, value-driven',
    icon: '▶️'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    duration: '30-90s',
    description: 'Professional, actionable insights',
    icon: '💼'
  }
]

export default function VideoScriptGenerator({ ideaId, onScriptGenerated }) {
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async (platform) => {
    setSelectedPlatform(platform)
    setLoading(true)

    try {
      const response = await fetch(`/api/scripts/generate/${ideaId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platform }),
      })

      if (response.ok) {
        const data = await response.json()
        onScriptGenerated(data)
      } else {
        alert('Failed to generate script. Please try again.')
      }
    } catch (error) {
      console.error('Error generating script:', error)
      alert('Failed to generate script. Please check your API key and try again.')
    } finally {
      setLoading(false)
      setSelectedPlatform(null)
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-warm-100 p-2 rounded-lg">
          <Video className="w-6 h-6 text-warm-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Create Video Script</h3>
          <p className="text-sm text-gray-600">Choose a platform to generate an optimized video script</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            onClick={() => handleGenerate(platform.id)}
            disabled={loading}
            className={`text-left p-4 rounded-lg border-2 transition-all ${
              selectedPlatform === platform.id
                ? 'border-warm-500 bg-warm-50'
                : 'border-gray-200 hover:border-warm-300 hover:shadow-md'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{platform.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-900">{platform.name}</h4>
                  {selectedPlatform === platform.id && loading && (
                    <Loader2 className="w-4 h-4 animate-spin text-warm-600" />
                  )}
                </div>
                <p className="text-xs text-warm-600 font-medium mb-1">{platform.duration}</p>
                <p className="text-sm text-gray-600">{platform.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-warm-500 mx-auto mb-2" />
          <p className="text-gray-600">
            Crafting your storytelling video script...
          </p>
        </div>
      )}
    </div>
  )
}
