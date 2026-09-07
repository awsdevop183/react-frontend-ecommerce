import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import OrderSummary from '../components/OrderSummary.jsx'
import { createOrder, priceCart } from '../api/orders.js'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../utils/format.js'

const FIELDS = [
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', width: 'full' },
  { name: 'fullName', label: 'Full name', autoComplete: 'name', width: 'full' },
  { name: 'address1', label: 'Address', autoComplete: 'address-line1', width: 'full' },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
  { name: 'postalCode', label: 'Postal code', autoComplete: 'postal-code' },
  { name: 'country', label: 'Country', autoComplete: 'country-name' },
  { name: 'phone', label: 'Phone (optional)', type: 'tel', autoComplete: 'tel', optional: true },
]

const EMPTY = Object.fromEntries(FIELDS.map((field) => [field.name, '']))

function validate(values) {
  const errors = {}
  if (!values.email.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email address'

  if (!values.fullName.trim()) errors.fullName = 'Name is required'
  if (!values.address1.trim()) errors.address1 = 'Address is required'
  if (!values.city.trim()) errors.city = 'City is required'
  if (!values.postalCode.trim()) errors.postalCode = 'Postal code is required'
  if (!values.country.trim()) errors.country = 'Country is required'

  return errors
}

export default function Checkout() {
  const { lines, itemCount, totals, clearCart } = useCart()
  const navigate = useNavigate()

  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // Nothing to check out — send them back rather than showing an empty form.
  if (lines.length === 0) return <Navigate to="/cart" replace />

  const setField = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      setErrors(validate({ ...values, [name]: value }))
    }
  }

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors(validate(values))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    setTouched(Object.fromEntries(FIELDS.map((field) => [field.name, true])))

    if (Object.keys(nextErrors).length > 0) {
      document.querySelector('.field-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    try {
      // Re-price before ordering: prices and stock can move while a cart sits open.
      const repriced = await priceCart(
        lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
      )
      const shortfall = repriced.find((line) => line.available < 1)
      if (shortfall) {
        throw new Error('One of your items just went out of stock. Please review your cart.')
      }

      const order = await createOrder({
        customer: values,
        lines: lines.map((line) => ({
          productId: line.productId,
          name: line.name,
          quantity: line.quantity,
          unitPriceCents: line.priceCents,
        })),
        totalCents: totals.totalCents,
      })

      clearCart()
      navigate('/order-confirmed', { state: { order }, replace: true })
    } catch (error) {
      setSubmitError(error.message || 'We could not place your order. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="checkout">
      <div className="page-head">
        <h1>Checkout</h1>
        <p className="page-sub">This is a demo — no payment details are collected or charged.</p>
      </div>

      <div className="checkout-layout">
        <form className="card checkout-form" onSubmit={handleSubmit} noValidate>
          <h2>Delivery details</h2>

          <div className="field-grid">
            {FIELDS.map((field) => {
              const invalid = touched[field.name] && errors[field.name]
              return (
                <div
                  className={`field ${field.width === 'full' ? 'field-full' : ''}`}
                  key={field.name}
                >
                  <label htmlFor={field.name}>{field.label}</label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type ?? 'text'}
                    autoComplete={field.autoComplete}
                    value={values[field.name]}
                    aria-invalid={Boolean(invalid)}
                    aria-describedby={invalid ? `${field.name}-error` : undefined}
                    className={invalid ? 'invalid' : undefined}
                    onChange={(event) => setField(field.name, event.target.value)}
                    onBlur={() => handleBlur(field.name)}
                  />
                  {invalid && (
                    <p className="field-error" id={`${field.name}-error`}>
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {submitError && (
            <p className="form-error" role="alert">
              {submitError}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting}>
            {submitting ? 'Placing order…' : `Place order · ${formatPrice(totals.totalCents)}`}
          </button>
        </form>

        <OrderSummary totals={totals} itemCount={itemCount} showProgress={false}>
          <ul className="summary-lines">
            {lines.map((line) => (
              <li key={line.productId}>
                <span>
                  {line.quantity} × {line.name}
                </span>
                <span>{formatPrice(line.priceCents * line.quantity)}</span>
              </li>
            ))}
          </ul>
        </OrderSummary>
      </div>
    </div>
  )
}
