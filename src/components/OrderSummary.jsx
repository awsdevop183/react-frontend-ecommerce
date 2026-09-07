import { formatPrice } from '../utils/format.js'
import { FREE_SHIPPING_THRESHOLD_CENTS } from '../utils/pricing.js'

export default function OrderSummary({ totals, itemCount, children, showProgress = true }) {
  const progress = Math.min(
    100,
    Math.round((totals.subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100),
  )

  return (
    <aside className="summary card">
      <h2>Order summary</h2>

      <dl className="summary-rows">
        <div>
          <dt>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</dt>
          <dd>{formatPrice(totals.subtotalCents)}</dd>
        </div>
        <div>
          <dt>Shipping</dt>
          <dd>{totals.shippingCents === 0 ? <span className="free">Free</span> : formatPrice(totals.shippingCents)}</dd>
        </div>
        <div>
          <dt>Estimated tax</dt>
          <dd>{formatPrice(totals.taxCents)}</dd>
        </div>
        <div className="summary-total">
          <dt>Total</dt>
          <dd>{formatPrice(totals.totalCents)}</dd>
        </div>
      </dl>

      {showProgress && totals.amountToFreeShippingCents > 0 && (
        <div className="ship-progress">
          <p>
            Add <strong>{formatPrice(totals.amountToFreeShippingCents)}</strong> for free shipping
          </p>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {children}
    </aside>
  )
}
