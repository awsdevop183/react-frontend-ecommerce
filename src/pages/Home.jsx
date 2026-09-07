import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { SkeletonGrid } from '../components/Skeleton.jsx'
import { listCategories, listProducts } from '../api/catalog.js'
import { useAsync } from '../hooks/useAsync.js'

const PROMISES = [
  { icon: '🚚', title: 'Free shipping over $75', copy: 'Two-day delivery on everything in stock.' },
  { icon: '↩️', title: '30-day returns', copy: 'Changed your mind? Send it back, no questions.' },
  { icon: '🛡️', title: 'Two-year warranty', copy: 'Covered against defects for a full 24 months.' },
]

export default function Home() {
  const featured = useAsync((signal) => listProducts({ sort: 'featured', pageSize: 4 }, { signal }), [])
  const categories = useAsync((signal) => listCategories({ signal }), [])

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">New season · Free returns</p>
          <h1>
            Gear that earns its place on your <span className="grad">desk</span>
          </h1>
          <p className="hero-sub">
            Audio, wearables and peripherals chosen for people who use them all day. No filler,
            no forty near-identical variants — just the good ones.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg">
              Shop all products
            </Link>
            <Link to="/products?categoryId=audio" className="btn btn-ghost btn-lg">
              Browse audio
            </Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
          <div className="orb orb-c" />
        </div>
      </section>

      <section className="promises">
        {PROMISES.map((promise) => (
          <div className="promise" key={promise.title}>
            <span className="promise-icon" aria-hidden="true">{promise.icon}</span>
            <div>
              <p className="promise-title">{promise.title}</p>
              <p className="promise-copy">{promise.copy}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Shop by category</h2>
        </div>
        <div className="category-tiles">
          {(categories.data ?? []).map((category) => (
            <Link key={category.id} to={`/products?categoryId=${category.id}`} className="category-tile">
              <span className="category-tile-name">{category.name}</span>
              <span className="category-tile-count">{category.productCount} products</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Featured this week</h2>
          <Link to="/products" className="link-accent">
            View all →
          </Link>
        </div>

        {featured.isLoading && <SkeletonGrid count={4} />}

        {featured.isError && (
          <p className="error-text">We could not load products right now. Please refresh.</p>
        )}

        {featured.data && (
          <div className="product-grid">
            {featured.data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
