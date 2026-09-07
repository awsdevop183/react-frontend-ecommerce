/**
 * In-memory stand-in for the REST API.
 *
 * Every function here mirrors the response shape the real backend will return
 * — including pagination envelopes — so swapping in HTTP later is a change of
 * transport, not a change of contract.
 */
import { categories, products } from './catalog.js'

const LATENCY_MS = 260

const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms))

function notFound(message) {
  const error = new Error(message)
  error.status = 404
  return error
}

function matchesSearch(product, term) {
  if (!term) return true
  const haystack = `${product.name} ${product.brand} ${product.summary}`.toLowerCase()
  return haystack.includes(term.trim().toLowerCase())
}

const SORTERS = {
  featured: (a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)) || b.rating - a.rating,
  'price-asc': (a, b) => a.priceCents - b.priceCents,
  'price-desc': (a, b) => b.priceCents - a.priceCents,
  rating: (a, b) => b.rating - a.rating,
  name: (a, b) => a.name.localeCompare(b.name),
}

export async function listCategories() {
  await delay(120)
  return categories.map((category) => ({
    ...category,
    productCount: products.filter((p) => p.categoryId === category.id).length,
  }))
}

export async function listProducts({
  search = '',
  categoryId = '',
  sort = 'featured',
  inStockOnly = false,
  maxPriceCents = null,
  page = 1,
  pageSize = 12,
} = {}) {
  await delay()

  const filtered = products
    .filter((product) => (categoryId ? product.categoryId === categoryId : true))
    .filter((product) => matchesSearch(product, search))
    .filter((product) => (inStockOnly ? product.stock > 0 : true))
    .filter((product) => (maxPriceCents ? product.priceCents <= maxPriceCents : true))
    .sort(SORTERS[sort] || SORTERS.featured)

  const start = (page - 1) * pageSize
  return {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
  }
}

export async function getProductBySlug(slug) {
  await delay(200)
  const product = products.find((candidate) => candidate.slug === slug)
  if (!product) throw notFound(`No product with slug "${slug}"`)
  return product
}

export async function listRelatedProducts(slug, limit = 4) {
  await delay(160)
  const product = products.find((candidate) => candidate.slug === slug)
  if (!product) return []
  return products
    .filter((candidate) => candidate.categoryId === product.categoryId && candidate.id !== product.id)
    .slice(0, limit)
}

/** Re-validates the cart against current prices and stock, like a real checkout would. */
export async function priceCart(lines = []) {
  await delay(180)
  return lines.map((line) => {
    const product = products.find((candidate) => candidate.id === line.productId)
    return {
      productId: line.productId,
      available: product ? Math.min(line.quantity, product.stock) : 0,
      unitPriceCents: product ? product.priceCents : 0,
    }
  })
}

export async function createOrder(order) {
  await delay(700)
  const reference = `CG-${Date.now().toString(36).toUpperCase().slice(-6)}`
  return {
    reference,
    status: 'confirmed',
    placedAt: new Date().toISOString(),
    email: order.customer.email,
    totalCents: order.totalCents,
    itemCount: order.lines.reduce((sum, line) => sum + line.quantity, 0),
    estimatedDelivery: new Date(Date.now() + 4 * 86_400_000).toISOString(),
  }
}
