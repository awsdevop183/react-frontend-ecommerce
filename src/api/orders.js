/**
 * Checkout API surface. Same mock/HTTP seam as the catalog.
 */
import { isMockMode, request } from './client.js'
import * as mock from './mock/handlers.js'

/** Re-checks prices and stock before the order is placed. */
export function priceCart(lines, { signal } = {}) {
  if (isMockMode) return mock.priceCart(lines)
  return request('/api/cart/price', { method: 'POST', body: { lines }, signal })
}

export function createOrder(order, { signal } = {}) {
  if (isMockMode) return mock.createOrder(order)
  return request('/api/orders', { method: 'POST', body: order, signal })
}
