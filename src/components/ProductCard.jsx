import { Link } from 'react-router-dom'
import ProductArt from './ProductArt.jsx'
import StarRating from './StarRating.jsx'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../utils/format.js'

export default function ProductCard({ product }) {
  const { addItem, quantityOf } = useCart()
  const inCart = quantityOf(product.id)
  const soldOut = product.stock === 0
  const atStockLimit = inCart >= product.stock

  const discount = product.compareAtCents
    ? Math.round((1 - product.priceCents / product.compareAtCents) * 100)
    : 0

  return (
    <article className="product-card">
      <Link to={`/products/${product.slug}`} className="product-card-media">
        <ProductArt art={product.art} alt={product.name} />
        {product.badge && <span className="badge badge-accent">{product.badge}</span>}
        {discount > 0 && <span className="badge badge-sale">−{discount}%</span>}
        {soldOut && <span className="media-veil">Sold out</span>}
      </Link>

      <div className="product-card-body">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">
          <Link to={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <StarRating value={product.rating} count={product.reviewCount} size="sm" />
        <p className="product-summary">{product.summary}</p>

        <div className="product-card-foot">
          <p className="price">
            {formatPrice(product.priceCents)}
            {product.compareAtCents && (
              <span className="price-was">{formatPrice(product.compareAtCents)}</span>
            )}
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={soldOut || atStockLimit}
            onClick={() => addItem(product, 1)}
          >
            {soldOut ? 'Sold out' : atStockLimit ? 'Max in cart' : inCart ? `In cart (${inCart})` : 'Add to cart'}
          </button>
        </div>

        {!soldOut && product.stock <= 10 && (
          <p className="stock-warning">Only {product.stock} left</p>
        )}
      </div>
    </article>
  )
}
