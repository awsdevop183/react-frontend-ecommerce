/**
 * Catalog API surface. Components import from here.
 *
 * Each function picks the mock handler or a real HTTP call based on
 * `isMockMode` - that single branch is the whole backend seam.
 */
import { buildQuery, isMockMode, request } from './client.js'
import * as mock from './mock/handlers.js'

export function listCategories({ signal } = {}) {
  if (isMockMode) return mock.listCategories()
  return request('/api/categories', { signal })
}

export function listProducts(params = {}, { signal } = {}) {
  if (isMockMode) return mock.listProducts(params)
  return request(`/api/products${buildQuery(params)}`, { signal })
}

export function getProductBySlug(slug, { signal } = {}) {
  if (isMockMode) return mock.getProductBySlug(slug)
  return request(`/api/products/${encodeURIComponent(slug)}`, { signal })
}

export function listRelatedProducts(slug, limit = 4, { signal } = {}) {
  if (isMockMode) return mock.listRelatedProducts(slug, limit)
  return request(`/api/products/${encodeURIComponent(slug)}/related${buildQuery({ limit })}`, { signal })
}
