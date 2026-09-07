import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Checkout from '../pages/Checkout.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { renderWithProviders, sampleProduct } from './testUtils.jsx'

/** Checkout redirects on an empty cart, so seed it through the real UI first. */
function renderWithFullCart() {
  return renderWithProviders(
    <>
      <ProductCard product={sampleProduct} />
      <Checkout />
    </>,
  )
}

describe('Checkout', () => {
  it('blocks submission and reports every missing required field', async () => {
    const user = userEvent.setup()
    renderWithFullCart()
    await user.click(screen.getByRole('button', { name: /add to cart/i }))

    await user.click(screen.getByRole('button', { name: /place order/i }))

    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Address is required')).toBeInTheDocument()
  })

  it('rejects a malformed email address', async () => {
    const user = userEvent.setup()
    renderWithFullCart()
    await user.click(screen.getByRole('button', { name: /add to cart/i }))

    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.tab()

    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
  })

  it('does not require the optional phone field', async () => {
    const user = userEvent.setup()
    renderWithFullCart()
    await user.click(screen.getByRole('button', { name: /add to cart/i }))

    await user.click(screen.getByRole('button', { name: /place order/i }))

    expect(screen.queryByText(/phone is required/i)).not.toBeInTheDocument()
  })
})
