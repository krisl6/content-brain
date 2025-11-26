import { Lightbulb, Tag, Calendar } from 'lucide-react'

export default function IdeaCard({ idea, onClick }) {
  const tags = idea.tags ? idea.tags.split(',').filter(Boolean) : []
  const date = new Date(idea.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <div
      onClick={onClick}
      className="card p-6 cursor-pointer hover:scale-105 transition-transform duration-200"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="bg-warm-100 p-2 rounded-lg flex-shrink-0">
          <Lightbulb className="w-5 h-5 text-warm-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 flex-1">{idea.title}</h3>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">{idea.content}</p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>

        {tags.length > 0 && (
          <div className="flex items-center gap-1">
            <Tag className="w-4 h-4 text-warm-500" />
            <span className="text-warm-600 font-medium">{tags[0]}</span>
            {tags.length > 1 && (
              <span className="text-gray-400 text-xs">+{tags.length - 1}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
