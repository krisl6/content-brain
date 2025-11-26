import { useState, useEffect } from 'react'
import { Plus, Lightbulb, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import NewIdeaModal from '../components/NewIdeaModal'
import IdeaCard from '../components/IdeaCard'

export default function Home() {
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewIdeaModal, setShowNewIdeaModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchIdeas()
  }, [])

  const fetchIdeas = async () => {
    try {
      const response = await fetch('/api/ideas')
      const data = await response.json()
      setIdeas(data)
    } catch (error) {
      console.error('Failed to fetch ideas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleIdeaCreated = (newIdea) => {
    setIdeas([newIdea, ...ideas])
    setShowNewIdeaModal(false)
  }

  const handleIdeaClick = (ideaId) => {
    navigate(`/idea/${ideaId}`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Ideas</h2>
          <p className="text-gray-600">Capture your creative thoughts and transform them into content</p>
        </div>
        <button
          onClick={() => setShowNewIdeaModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Idea
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your ideas...</p>
        </div>
      ) : ideas.length === 0 ? (
        <div className="text-center py-16 card p-12">
          <div className="bg-warm-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-10 h-10 text-warm-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No ideas yet</h3>
          <p className="text-gray-600 mb-6">Start capturing your creative thoughts and transform them into amazing content!</p>
          <button
            onClick={() => setShowNewIdeaModal(true)}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Create Your First Idea
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onClick={() => handleIdeaClick(idea.id)}
            />
          ))}
        </div>
      )}

      {showNewIdeaModal && (
        <NewIdeaModal
          onClose={() => setShowNewIdeaModal(false)}
          onIdeaCreated={handleIdeaCreated}
        />
      )}
    </div>
  )
}
