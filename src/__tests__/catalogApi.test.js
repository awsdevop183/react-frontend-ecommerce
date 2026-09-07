import { describe, expect, it } from 'vitest'
import { listCategories, listProducts, getProductBySlug } from '../api/catalog.js'

describe('catalog API (mock mode)', () => {
  it('returns a paginated envelope', async () => {
    const page = await listProducts({ pageSize: 4 })
    expect(page.items).toHaveLength(4)
    expect(page.total).toBeGreaterThan(4)
    expect(page).toMatchObject({ page: 1, pageSize: 4 })
  })

  it('filters by category', async () => {
    const page = await listProducts({ categoryId: 'audio' })
    expect(page.items.length).toBeGreaterThan(0)
    expect(page.items.every((product) => product.categoryId === 'audio')).toBe(true)
  })

  it('matches a search term against name, brand and summary', async () => {
    const page = await listProducts({ search: 'keyboard' })
    expect(page.items.some((product) => /keyboard/i.test(product.name))).toBe(true)
  })

  it('sorts by price ascending', async () => {
    const { items } = await listProducts({ sort: 'price-asc' })
    const prices = items.map((product) => product.priceCents)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })

  it('excludes sold-out products when asked', async () => {
    const { items } = await listProducts({ inStockOnly: true, pageSize: 50 })
    expect(items.every((product) => product.stock > 0)).toBe(true)
  })

  it('reports a product count per category', async () => {
    const categories = await listCategories()
    expect(categories.length).toBeGreaterThan(0)
    expect(categories.every((category) => category.productCount > 0)).toBe(true)
  })

  it('rejects an unknown slug', async () => {
    await expect(getProductBySlug('does-not-exist')).rejects.toThrow(/no product/i)
  })
})
