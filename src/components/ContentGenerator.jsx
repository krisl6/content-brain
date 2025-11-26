import { useState, useEffect } from 'react'
import { Sparkles, Loader2, FileText } from 'lucide-react'

export default function ContentGenerator({ ideaId }) {
  const [generatedContent, setGeneratedContent] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchingContent, setFetchingContent] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [ideaId])

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/content/idea/${ideaId}`)
      if (response.ok) {
        const data = await response.json()
        setGeneratedContent(data)
      }
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setFetchingContent(false)
    }
  }

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/content/generate/${ideaId}`, {
        method: 'POST',
      })

      if (response.ok) {
        const newContent = await response.json()
        setGeneratedContent([newContent, ...generatedContent])
      } else {
        alert('Failed to generate content. Please try again.')
      }
    } catch (error) {
      console.error('Error generating content:', error)
      alert('Failed to generate content. Please check your API key and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (fetchingContent) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-warm-500 mx-auto" />
      </div>
    )
  }

  return (
    <div>
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Generate Written Content</h3>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn btn-primary flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Content
              </>
            )}
          </button>
        </div>
        <p className="text-gray-600">
          Transform your idea into warm, conversational written content with valuable insights.
        </p>
      </div>

      {generatedContent.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="bg-warm-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-warm-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No content generated yet</h4>
          <p className="text-gray-600">Click the button above to generate your first piece of content!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {generatedContent.map((content) => (
            <div key={content.id} className="card p-6">
              <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                <FileText className="w-4 h-4" />
                <span>
                  {new Date(content.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="prose prose-warm max-w-none">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{content.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
