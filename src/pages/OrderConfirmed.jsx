import { Link, Navigate, useLocation } from 'react-router-dom'
import { formatDate, formatPrice } from '../utils/format.js'

export default function OrderConfirmed() {
  const { state } = useLocation()
  const order = state?.order

  // Reached by deep link or refresh - there is no order to show.
  if (!order) return <Navigate to="/" replace />

  return (
    <div className="confirmation">
      <div className="confirm-icon" aria-hidden="true">✓</div>
      <h1>Thanks, your order is confirmed</h1>
      <p className="page-sub">
        A receipt is on its way to <strong>{order.email}</strong>.
      </p>

      <dl className="confirm-details card">
        <div>
          <dt>Order reference</dt>
          <dd className="mono">{order.reference}</dd>
        </div>
        <div>
          <dt>Items</dt>
          <dd>{order.itemCount}</dd>
        </div>
        <div>
          <dt>Total paid</dt>
          <dd>{formatPrice(order.totalCents)}</dd>
        </div>
        <div>
          <dt>Estimated delivery</dt>
          <dd>{formatDate(order.estimatedDelivery)}</dd>
        </div>
      </dl>

      <Link to="/products" className="btn btn-primary btn-lg">
        Continue shopping
      </Link>
    </div>
  )
}
