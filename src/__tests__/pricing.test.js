import { describe, expect, it } from 'vitest'
import { calculateTotals, FREE_SHIPPING_THRESHOLD_CENTS, SHIPPING_FLAT_CENTS } from '../utils/pricing.js'

const line = (priceCents, quantity) => ({ priceCents, quantity })

describe('calculateTotals', () => {
  it('returns zeroes for an empty cart and charges no shipping', () => {
    const totals = calculateTotals([])
    expect(totals.subtotalCents).toBe(0)
    expect(totals.shippingCents).toBe(0)
    expect(totals.totalCents).toBe(0)
  })

  it('multiplies price by quantity across lines', () => {
    const totals = calculateTotals([line(1000, 2), line(2550, 3)])
    expect(totals.subtotalCents).toBe(2000 + 7650)
  })

  it('charges flat shipping below the free threshold', () => {
    const totals = calculateTotals([line(FREE_SHIPPING_THRESHOLD_CENTS - 100, 1)])
    expect(totals.shippingCents).toBe(SHIPPING_FLAT_CENTS)
    expect(totals.amountToFreeShippingCents).toBe(100)
  })

  it('waives shipping exactly at the threshold', () => {
    const totals = calculateTotals([line(FREE_SHIPPING_THRESHOLD_CENTS, 1)])
    expect(totals.shippingCents).toBe(0)
    expect(totals.amountToFreeShippingCents).toBe(0)
  })

  it('keeps the total as an integer number of cents', () => {
    const totals = calculateTotals([line(1999, 3)])
    expect(Number.isInteger(totals.taxCents)).toBe(true)
    expect(Number.isInteger(totals.totalCents)).toBe(true)
    expect(totals.totalCents).toBe(totals.subtotalCents + totals.shippingCents + totals.taxCents)
  })
})
