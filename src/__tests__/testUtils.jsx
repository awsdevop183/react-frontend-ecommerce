import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../context/CartContext.jsx'

/** Most components need a router and the cart, so wrap them once here. */
export function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CartProvider>{ui}</CartProvider>
    </MemoryRouter>,
  )
}

export const sampleProduct = {
  id: 'p-test',
  slug: 'test-headphones',
  name: 'Test Headphones',
  brand: 'Contoso Audio',
  categoryId: 'audio',
  priceCents: 19900,
  compareAtCents: 24900,
  rating: 4.5,
  reviewCount: 120,
  stock: 2,
  badge: 'New',
  art: { glyph: 'headphones', from: '#6366f1', to: '#8b5cf6' },
  summary: 'A product used in tests.',
  description: 'Longer copy.',
  features: ['Feature one'],
  specs: { Driver: '40mm' },
}
