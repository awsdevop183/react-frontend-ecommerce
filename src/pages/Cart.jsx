import { Link } from 'react-router-dom'
import CartLineItem from '../components/CartLineItem.jsx'
import EmptyState from '../components/EmptyState.jsx'
import OrderSummary from '../components/OrderSummary.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function Cart() {
  const { lines, itemCount, totals, clearCart } = useCart()

  if (lines.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="Your cart is empty"
        message="Once you add something, it will show up here and stay put between visits."
        action={
          <Link to="/products" className="btn btn-primary">
            Start shopping
          </Link>
        }
      />
    )
  }

  return (
    <div className="cart-page">
      <div className="page-head">
        <h1>Your cart</h1>
        <p className="page-sub">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
      </div>

      <div className="cart-layout">
        <div>
          <ul className="cart-lines">
            {lines.map((line) => (
              <CartLineItem key={line.productId} line={line} />
            ))}
          </ul>
          <div className="cart-actions">
            <Link to="/products" className="link-accent">
              ← Continue shopping
            </Link>
            <button type="button" className="link-danger" onClick={clearCart}>
              Clear cart
            </button>
          </div>
        </div>

        <OrderSummary totals={totals} itemCount={itemCount}>
          <Link to="/checkout" className="btn btn-primary btn-block btn-lg">
            Proceed to checkout
          </Link>
          <p className="summary-note">Taxes calculated at checkout. No payment is taken in this demo.</p>
        </OrderSummary>
      </div>
    </div>
  )
}
