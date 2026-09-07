import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Cart from '../pages/Cart.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { renderWithProviders, sampleProduct } from './testUtils.jsx'

describe('Cart page', () => {
  it('shows the empty state when nothing has been added', () => {
    renderWithProviders(<Cart />)
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
  })

  it('lists an added product with its line total', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <>
        <ProductCard product={sampleProduct} />
        <Cart />
      </>,
    )

    await user.click(screen.getByRole('button', { name: /add to cart/i }))

    expect(screen.getByRole('heading', { name: /your cart/i })).toBeInTheDocument()
    expect(screen.getByText('$199.00 each')).toBeInTheDocument()
  })

  it('removes the line and returns to the empty state', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <>
        <ProductCard product={sampleProduct} />
        <Cart />
      </>,
    )

    await user.click(screen.getByRole('button', { name: /add to cart/i }))
    await user.click(screen.getByRole('button', { name: /^remove$/i }))

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
  })
})
