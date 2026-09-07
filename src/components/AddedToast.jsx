import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

/** Brief confirmation after "Add to cart", so the action is not silent. */
export default function AddedToast() {
  const { lastAddedId, lines, dismissToast } = useCart()
  const line = lines.find((candidate) => candidate.productId === lastAddedId)

  useEffect(() => {
    if (!lastAddedId) return undefined
    const timer = setTimeout(dismissToast, 3200)
    return () => clearTimeout(timer)
  }, [lastAddedId, dismissToast])

  if (!line) return null

  return (
    <div className="toast" role="status">
      <span className="toast-check" aria-hidden="true">✓</span>
      <span>
        <strong>{line.name}</strong> added to cart
      </span>
      <Link to="/cart" className="toast-link" onClick={dismissToast}>
        View cart
      </Link>
      <button type="button" className="toast-close" onClick={dismissToast} aria-label="Dismiss">
        ×
      </button>
    </div>
  )
}
