import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { calculateTotals } from '../utils/pricing.js'

const STORAGE_KEY = 'contoso-gear.cart.v1'

const CartContext = createContext(null)

/**
 * Cart lines store a snapshot of the product (name, price, art) rather than
 * just an id, so the cart renders instantly without a second fetch. Checkout
 * re-prices against the API before the order is placed.
 */
function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { product, quantity } = action
      const existing = state.lines.find((line) => line.productId === product.id)
      const alreadyInCart = existing?.quantity ?? 0
      const nextQuantity = Math.min(alreadyInCart + quantity, product.stock)

      if (nextQuantity === alreadyInCart) return state // stock cap reached

      const lines = existing
        ? state.lines.map((line) =>
            line.productId === product.id ? { ...line, quantity: nextQuantity } : line,
          )
        : [
            ...state.lines,
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              brand: product.brand,
              priceCents: product.priceCents,
              art: product.art,
              stock: product.stock,
              quantity: nextQuantity,
            },
          ]

      return { ...state, lines, lastAddedId: product.id }
    }

    case 'setQuantity': {
      const lines = state.lines
        .map((line) =>
          line.productId === action.productId
            ? { ...line, quantity: Math.max(0, Math.min(action.quantity, line.stock)) }
            : line,
        )
        .filter((line) => line.quantity > 0)
      return { ...state, lines }
    }

    case 'remove':
      return { ...state, lines: state.lines.filter((line) => line.productId !== action.productId) }

    case 'clear':
      return { ...state, lines: [], lastAddedId: null }

    case 'dismissToast':
      return { ...state, lastAddedId: null }

    default:
      return state
  }
}

function readStoredCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed?.lines) ? { lines: parsed.lines, lastAddedId: null } : null
  } catch {
    return null // private mode, disabled storage, or corrupt JSON
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => readStoredCart() ?? { lines: [], lastAddedId: null })

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines: state.lines }))
    } catch {
      // Storage unavailable — the cart still works for this session.
    }
  }, [state.lines])

  const value = useMemo(() => {
    const totals = calculateTotals(state.lines)
    return {
      lines: state.lines,
      lastAddedId: state.lastAddedId,
      itemCount: state.lines.reduce((sum, line) => sum + line.quantity, 0),
      totals,
      quantityOf: (productId) => state.lines.find((l) => l.productId === productId)?.quantity ?? 0,
      addItem: (product, quantity = 1) => dispatch({ type: 'add', product, quantity }),
      setQuantity: (productId, quantity) => dispatch({ type: 'setQuantity', productId, quantity }),
      removeItem: (productId) => dispatch({ type: 'remove', productId }),
      clearCart: () => dispatch({ type: 'clear' }),
      dismissToast: () => dispatch({ type: 'dismissToast' }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside a <CartProvider>')
  return context
}
