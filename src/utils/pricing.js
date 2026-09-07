export const FREE_SHIPPING_THRESHOLD_CENTS = 7500
export const SHIPPING_FLAT_CENTS = 795
export const TAX_RATE = 0.0825

/**
 * Single source of truth for order maths. The backend will eventually own
 * this, but the shape it returns should stay identical.
 */
export function calculateTotals(lines = []) {
  const subtotalCents = lines.reduce((sum, line) => sum + line.priceCents * line.quantity, 0)
  const shippingCents =
    subtotalCents === 0 || subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS
  const taxCents = Math.round(subtotalCents * TAX_RATE)

  return {
    subtotalCents,
    shippingCents,
    taxCents,
    totalCents: subtotalCents + shippingCents + taxCents,
    amountToFreeShippingCents: Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents),
  }
}
