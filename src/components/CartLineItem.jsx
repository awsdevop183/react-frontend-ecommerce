import { Link } from 'react-router-dom'
import ProductArt from './ProductArt.jsx'
import QuantityStepper from './QuantityStepper.jsx'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../utils/format.js'

export default function CartLineItem({ line }) {
  const { setQuantity, removeItem } = useCart()

  return (
    <li className="cart-line">
      <Link to={`/products/${line.slug}`} className="cart-line-art">
        <ProductArt art={line.art} alt={line.name} />
      </Link>

      <div className="cart-line-info">
        <p className="product-brand">{line.brand}</p>
        <h3>
          <Link to={`/products/${line.slug}`}>{line.name}</Link>
        </h3>
        <p className="cart-line-unit">{formatPrice(line.priceCents)} each</p>
        <button type="button" className="link-danger" onClick={() => removeItem(line.productId)}>
          Remove
        </button>
      </div>

      <div className="cart-line-actions">
        <QuantityStepper
          value={line.quantity}
          max={line.stock}
          onChange={(quantity) => setQuantity(line.productId, quantity)}
          label={`Quantity for ${line.name}`}
        />
        <p className="cart-line-total">{formatPrice(line.priceCents * line.quantity)}</p>
      </div>
    </li>
  )
}
