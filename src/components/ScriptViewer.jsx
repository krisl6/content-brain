import { Film, Zap, Lightbulb, MessageCircle, Clock, Camera, MessageSquare, Eye } from 'lucide-react'

export default function ScriptViewer({ scriptData }) {
  const { script, storyboard } = scriptData

  const totalDuration = storyboard.reduce((sum, scene) => sum + scene.duration, 0)

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-warm-100 p-2 rounded-lg">
              <Film className="w-6 h-6 text-warm-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Video Script</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="px-3 py-1 bg-warm-100 text-warm-700 rounded-full text-sm font-semibold uppercase">
                  {script.platform}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {script.total_duration}s
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-l-4 border-warm-500 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-warm-600" />
              <h4 className="font-semibold text-gray-900 uppercase text-sm">Hook (First 3 seconds)</h4>
            </div>
            <p className="text-gray-800 leading-relaxed">{script.hook}</p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900 uppercase text-sm">Story</h4>
            </div>
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{script.story}</p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900 uppercase text-sm">Key Insight</h4>
            </div>
            <p className="text-gray-800 leading-relaxed">{script.insight}</p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-900 uppercase text-sm">Call to Action</h4>
            </div>
            <p className="text-gray-800 leading-relaxed">{script.cta}</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Camera className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Storyboard & Timeline</h3>
            <p className="text-sm text-gray-600">Visual breakdown of your video</p>
          </div>
        </div>

        <div className="mb-6 bg-gray-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Timeline</span>
            <span className="text-sm text-gray-600">{totalDuration}s total</span>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
            {storyboard.map((scene, index) => {
              const colors = ['bg-warm-500', 'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500']
              const width = (scene.duration / totalDuration) * 100
              return (
                <div
                  key={scene.id}
                  className={`${colors[index % colors.length]} transition-all hover:opacity-80`}
                  style={{ width: `${width}%` }}
                  title={`Scene ${scene.sequence}: ${scene.duration}s`}
                />
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          {storyboard.map((scene, index) => {
            const colors = [
              { bg: 'bg-warm-50', border: 'border-warm-500', text: 'text-warm-700' },
              { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700' },
              { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-700' },
              { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700' },
              { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-700' },
              { bg: 'bg-pink-50', border: 'border-pink-500', text: 'text-pink-700' }
            ]
            const color = colors[index % colors.length]

            return (
              <div key={scene.id} className={`border-l-4 ${color.border} pl-4 py-3 ${color.bg} rounded-r-lg`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${color.text} text-lg`}>Scene {scene.sequence}</span>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {scene.duration}s
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-semibold text-gray-700 uppercase">Visual</span>
                    </div>
                    <p className="text-gray-800 ml-6">{scene.visual_description}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-semibold text-gray-700 uppercase">Voiceover</span>
                    </div>
                    <p className="text-gray-800 ml-6 italic">{scene.voiceover}</p>
                  </div>

                  {scene.camera_notes && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Camera className="w-4 h-4 text-gray-600" />
                        <span className="text-xs font-semibold text-gray-700 uppercase">Camera</span>
                      </div>
                      <p className="text-gray-600 ml-6 text-sm">{scene.camera_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
