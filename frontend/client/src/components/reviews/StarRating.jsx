import { useState } from 'react'

function StarRating({ rating, onRatingChange, readOnly = false }) {
  const [hover, setHover] = useState(0)

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readOnly && onRatingChange(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          style={{
            cursor: readOnly ? 'default' : 'pointer',
            fontSize: '24px',
            color: star <= (hover || rating) ? '#ffd700' : '#444'
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default StarRating