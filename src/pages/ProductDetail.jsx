import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductArt from '../components/ProductArt.jsx'
import ProductCard from '../components/ProductCard.jsx'
import QuantityStepper from '../components/QuantityStepper.jsx'
import StarRating from '../components/StarRating.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { getProductBySlug, listRelatedProducts } from '../api/catalog.js'
import { useAsync } from '../hooks/useAsync.js'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../utils/format.js'

export default function ProductDetail() {
  const { slug } = useParams()
  const [quantity, setQuantity] = useState(1)
  const { addItem, quantityOf } = useCart()

  const product = useAsync((signal) => getProductBySlug(slug, { signal }), [slug])
  const related = useAsync((signal) => listRelatedProducts(slug, 4, { signal }), [slug])

  if (product.isLoading) {
    return (
      <div className="detail-layout">
        <div className="skeleton skeleton-hero" />
        <div className="detail-info">
          <div className="skeleton skeleton-line" style={{ width: '30%' }} />
          <div className="skeleton skeleton-line" style={{ width: '70%', height: 32 }} />
          <div className="skeleton skeleton-line" style={{ width: '50%' }} />
          <div className="skeleton skeleton-line" style={{ width: '90%' }} />
        </div>
      </div>
    )
  }

  if (product.isError) {
    return (
      <EmptyState
        icon="🧭"
        title="Product not found"
        message="That product may have been removed or the link is wrong."
        action={
          <Link to="/products" className="btn btn-primary">
            Back to shop
          </Link>
        }
      />
    )
  }

  const item = product.data
  const inCart = quantityOf(item.id)
  const remaining = item.stock - inCart
  const soldOut = item.stock === 0

  return (
    <div className="detail">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/products?categoryId=${item.categoryId}`}>{item.brand}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{item.name}</span>
      </nav>

      <div className="detail-layout">
        <div className="detail-media">
          <ProductArt art={item.art} alt={item.name} className="detail-art" />
          {item.badge && <span className="badge badge-accent detail-badge">{item.badge}</span>}
        </div>

        <div className="detail-info">
          <p className="product-brand">{item.brand}</p>
          <h1>{item.name}</h1>
          <StarRating value={item.rating} count={item.reviewCount} />

          <p className="detail-price">
            {formatPrice(item.priceCents)}
            {item.compareAtCents && <span className="price-was">{formatPrice(item.compareAtCents)}</span>}
          </p>

          <p className="detail-description">{item.description}</p>

          <ul className="feature-list">
            {item.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>

          <div className="detail-buy">
            <QuantityStepper
              value={quantity}
              max={Math.max(1, remaining)}
              onChange={setQuantity}
            />
            <button
              type="button"
              className="btn btn-primary btn-lg"
              disabled={soldOut || remaining <= 0}
              onClick={() => addItem(item, quantity)}
            >
              {soldOut ? 'Sold out' : remaining <= 0 ? 'All stock in cart' : 'Add to cart'}
            </button>
          </div>

          <p className={soldOut ? 'stock-line out' : 'stock-line'}>
            {soldOut
              ? 'Out of stock — check back soon'
              : `In stock · ${item.stock} available${inCart ? ` · ${inCart} in your cart` : ''}`}
          </p>

          <table className="spec-table">
            <caption>Specifications</caption>
            <tbody>
              {Object.entries(item.specs).map(([label, value]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {related.data?.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>You might also like</h2>
          </div>
          <div className="product-grid">
            {related.data.map((candidate) => (
              <ProductCard key={candidate.id} product={candidate} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
