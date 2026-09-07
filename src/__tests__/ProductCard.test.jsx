import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import ProductCard from '../components/ProductCard.jsx'
import { renderWithProviders, sampleProduct } from './testUtils.jsx'

describe('ProductCard', () => {
  it('shows the price and the struck-through compare-at price', () => {
    renderWithProviders(<ProductCard product={sampleProduct} />)
    expect(screen.getByText('$199.00')).toBeInTheDocument()
    expect(screen.getByText('$249.00')).toBeInTheDocument()
  })

  it('shows a discount badge derived from the compare-at price', () => {
    renderWithProviders(<ProductCard product={sampleProduct} />)
    expect(screen.getByText('−20%')).toBeInTheDocument()
  })

  it('adds to the cart and reflects the quantity on the button', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProductCard product={sampleProduct} />)

    await user.click(screen.getByRole('button', { name: /add to cart/i }))
    expect(screen.getByRole('button', { name: /in cart \(1\)/i })).toBeInTheDocument()
  })

  it('stops at the available stock', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProductCard product={sampleProduct} />) // stock: 2

    await user.click(screen.getByRole('button', { name: /add to cart/i }))
    await user.click(screen.getByRole('button', { name: /in cart \(1\)/i }))

    const button = screen.getByRole('button', { name: /max in cart/i })
    expect(button).toBeDisabled()
  })

  it('disables the button for a sold-out product', () => {
    renderWithProviders(<ProductCard product={{ ...sampleProduct, stock: 0 }} />)
    expect(screen.getByRole('button', { name: /sold out/i })).toBeDisabled()
  })

  it('warns when stock is low', () => {
    renderWithProviders(<ProductCard product={sampleProduct} />)
    expect(screen.getByText(/only 2 left/i)).toBeInTheDocument()
  })
})
