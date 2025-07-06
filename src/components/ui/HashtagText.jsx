import { useHashtags } from '../../hooks/useHashtags'

function HashtagText({ text, className = '' }) {
  const { parseTextWithHashtags } = useHashtags()
  const parts = parseTextWithHashtags(text)

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.type === 'hashtag') {
          return (
            <span
              key={index}
              className="text-blue-600 font-semibold hover:text-blue-700 cursor-pointer transition-colors"
              onClick={() => {
                // Aquí se podría implementar búsqueda por hashtag
                console.log('Clicked hashtag:', part.tag)
              }}
            >
              {part.content}
            </span>
          )
        }
        return <span key={index}>{part.content}</span>
      })}
    </span>
  )
}

export default HashtagText