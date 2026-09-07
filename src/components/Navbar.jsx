import { useState } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Navbar() {
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [term, setTerm] = useState(searchParams.get('search') ?? '')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = term.trim()
    navigate(trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : '/products')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" aria-label="Contoso Gear home">
          <span className="brand-mark" aria-hidden="true">CG</span>
          <span className="brand-name">Contoso Gear</span>
        </Link>

        <nav className="nav-links" aria-label="Main">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/products">Shop</NavLink>
        </nav>

        <form className="search" role="search" onSubmit={handleSubmit}>
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            value={term}
            placeholder="Search products"
            aria-label="Search products"
            onChange={(event) => setTerm(event.target.value)}
          />
        </form>

        <Link to="/cart" className="cart-button" aria-label={`Cart, ${itemCount} items`}>
          <span aria-hidden="true">🛒</span>
          {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
        </Link>
      </div>
    </header>
  )
}
