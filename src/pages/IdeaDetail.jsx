import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Video, Sparkles, Loader2 } from 'lucide-react'
import ContentGenerator from '../components/ContentGenerator'
import VideoScriptGenerator from '../components/VideoScriptGenerator'
import ScriptViewer from '../components/ScriptViewer'

export default function IdeaDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('content')
  const [scripts, setScripts] = useState([])
  const [selectedScript, setSelectedScript] = useState(null)

  useEffect(() => {
    fetchIdea()
    fetchScripts()
  }, [id])

  const fetchIdea = async () => {
    try {
      const response = await fetch(`/api/ideas/${id}`)
      if (response.ok) {
        const data = await response.json()
        setIdea(data)
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Failed to fetch idea:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const fetchScripts = async () => {
    try {
      const response = await fetch(`/api/scripts/idea/${id}`)
      if (response.ok) {
        const data = await response.json()
        setScripts(data)
      }
    } catch (error) {
      console.error('Failed to fetch scripts:', error)
    }
  }

  const handleScriptGenerated = (newScript) => {
    setScripts([newScript.script, ...scripts])
    setSelectedScript(newScript)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-12 h-12 animate-spin text-warm-500 mx-auto" />
        <p className="mt-4 text-gray-600">Loading idea...</p>
      </div>
    )
  }

  if (!idea) {
    return null
  }

  const tags = idea.tags ? idea.tags.split(',').filter(Boolean) : []

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Ideas
      </button>

      <div className="card p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{idea.title}</h1>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">{idea.content}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-warm-100 text-warm-700 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
              activeTab === 'content'
                ? 'text-warm-600 border-b-2 border-warm-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-5 h-5" />
            Written Content
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
              activeTab === 'video'
                ? 'text-warm-600 border-b-2 border-warm-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Video className="w-5 h-5" />
            Video Scripts
          </button>
        </div>
      </div>

      {activeTab === 'content' && <ContentGenerator ideaId={id} />}

      {activeTab === 'video' && (
        <div>
          <VideoScriptGenerator
            ideaId={id}
            onScriptGenerated={handleScriptGenerated}
          />

          {selectedScript && (
            <div className="mt-6">
              <ScriptViewer scriptData={selectedScript} />
            </div>
          )}

          {scripts.length > 0 && !selectedScript && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Previous Scripts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scripts.map((script) => (
                  <button
                    key={script.id}
                    onClick={async () => {
                      const response = await fetch(`/api/scripts/${script.id}`)
                      const data = await response.json()
                      setSelectedScript(data)
                    }}
                    className="card p-4 text-left hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-warm-100 text-warm-700 rounded text-xs font-semibold uppercase">
                        {script.platform}
                      </span>
                      <span className="text-sm text-gray-500">
                        {script.total_duration}s
                      </span>
                    </div>
                    <p className="text-gray-700 line-clamp-2">{script.hook}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
