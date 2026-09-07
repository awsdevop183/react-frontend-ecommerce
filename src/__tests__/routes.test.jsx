import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '../App.jsx'
import { CartProvider } from '../context/CartContext.jsx'

/** Renders the real app, router and all, at a given URL. */
function renderApp(route) {
  return render(
    <MemoryRouter
      initialEntries={[route]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CartProvider>
        <App />
      </CartProvider>
    </MemoryRouter>,
  )
}

describe('routing', () => {
  it('renders the home page with featured products once loaded', async () => {
    renderApp('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/earns its place/i)
    await waitFor(() => expect(screen.getByText('Featured this week')).toBeInTheDocument())
    await waitFor(() => expect(screen.getAllByRole('article').length).toBeGreaterThan(0))
  })

  it('renders the catalog and honours a category filter from the URL', async () => {
    renderApp('/products?categoryId=audio')
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Audio' })).toBeInTheDocument())
    await waitFor(() => expect(screen.getByText('Aether Pro Headphones')).toBeInTheDocument())
  })

  it('renders a product detail page from its slug', async () => {
    renderApp('/products/tactile-75-keyboard')
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { level: 1, name: 'Tactile 75 Mechanical Keyboard' }),
      ).toBeInTheDocument(),
    )
    expect(screen.getByText('Specifications')).toBeInTheDocument()
  })

  it('shows a friendly message for an unknown product slug', async () => {
    renderApp('/products/no-such-product')
    await waitFor(() => expect(screen.getByText(/product not found/i)).toBeInTheDocument())
  })

  it('renders the 404 page for an unknown route', () => {
    renderApp('/totally-made-up')
    expect(screen.getByText(/page not found/i)).toBeInTheDocument()
  })

  it('redirects to the cart when checking out with nothing in it', () => {
    renderApp('/checkout')
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
  })

  it('adds from the catalog and reflects the count in the navbar', async () => {
    const user = userEvent.setup()
    renderApp('/products')

    await waitFor(() => expect(screen.getAllByRole('article').length).toBeGreaterThan(0))
    const [firstAdd] = screen.getAllByRole('button', { name: /add to cart/i })
    await user.click(firstAdd)

    expect(screen.getByLabelText(/cart, 1 items/i)).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText(/added to cart/i)).toBeInTheDocument())
  })
})
