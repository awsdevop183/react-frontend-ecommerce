export default function StarRating({ value = 0, count, size = 'md' }) {
  const rounded = Math.round(value * 2) / 2

  return (
    <span className={`rating rating-${size}`}>
      <span className="rating-stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = Math.max(0, Math.min(1, rounded - star + 1))
          return (
            <span className="star" key={star}>
              <span className="star-empty">★</span>
              <span className="star-fill" style={{ width: `${fill * 100}%` }}>
                ★
              </span>
            </span>
          )
        })}
      </span>
      <span className="sr-only">{value} out of 5 stars</span>
      {count != null && <span className="rating-count">({count.toLocaleString()})</span>}
    </span>
  )
}
