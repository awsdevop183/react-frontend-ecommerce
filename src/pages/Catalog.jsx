import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import CatalogFilters from '../components/CatalogFilters.jsx'
import ProductCard from '../components/ProductCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { SkeletonGrid } from '../components/Skeleton.jsx'
import { listCategories, listProducts } from '../api/catalog.js'
import { useAsync } from '../hooks/useAsync.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'

const DEFAULTS = {
  search: '',
  categoryId: '',
  sort: 'featured',
  inStockOnly: false,
  maxPriceCents: 0,
}

/**
 * Filters live in the URL, not component state — so a filtered view can be
 * shared, bookmarked, and survives the back button.
 */
export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(
    () => ({
      search: searchParams.get('search') ?? DEFAULTS.search,
      categoryId: searchParams.get('categoryId') ?? DEFAULTS.categoryId,
      sort: searchParams.get('sort') ?? DEFAULTS.sort,
      inStockOnly: searchParams.get('inStockOnly') === 'true',
      maxPriceCents: Number(searchParams.get('maxPriceCents') ?? DEFAULTS.maxPriceCents),
    }),
    [searchParams],
  )

  const handleChange = useCallback(
    (next) => {
      const params = new URLSearchParams()
      for (const [key, value] of Object.entries(next)) {
        if (value === DEFAULTS[key] || value === '' || value === false || value === 0) continue
        params.set(key, String(value))
      }
      setSearchParams(params, { replace: true })
    },
    [setSearchParams],
  )

  const reset = useCallback(() => setSearchParams(new URLSearchParams()), [setSearchParams])

  // Typing should not fire a request per keystroke, but the other filters
  // should feel instant — so only the search term is debounced.
  const debouncedSearch = useDebouncedValue(filters.search, 300)

  const categories = useAsync((signal) => listCategories({ signal }), [])
  const results = useAsync(
    (signal) =>
      listProducts(
        {
          search: debouncedSearch,
          categoryId: filters.categoryId,
          sort: filters.sort,
          inStockOnly: filters.inStockOnly,
          maxPriceCents: filters.maxPriceCents || null,
          pageSize: 24,
        },
        { signal },
      ),
    [debouncedSearch, filters.categoryId, filters.sort, filters.inStockOnly, filters.maxPriceCents],
  )

  const activeCategory = (categories.data ?? []).find((c) => c.id === filters.categoryId)

  return (
    <div className="catalog">
      <div className="page-head">
        <h1>{activeCategory ? activeCategory.name : 'All products'}</h1>
        <p className="page-sub">
          {filters.search
            ? `Results for “${filters.search}”`
            : 'Everything we stock, filtered however you like.'}
        </p>
      </div>

      <div className="catalog-layout">
        <CatalogFilters
          categories={categories.data ?? []}
          filters={filters}
          onChange={handleChange}
          onReset={reset}
          resultCount={results.data?.total}
        />

        <div className="catalog-results">
          {results.isLoading && <SkeletonGrid count={6} />}

          {results.isError && (
            <EmptyState
              icon="⚠️"
              title="Something went wrong"
              message="We could not load the catalog. Please try again."
            />
          )}

          {results.data?.items.length === 0 && (
            <EmptyState
              title="No products match those filters"
              message="Try widening the price range or clearing the search term."
              action={
                <button type="button" className="btn btn-primary" onClick={reset}>
                  Clear filters
                </button>
              }
            />
          )}

          {results.data?.items.length > 0 && (
            <div className="product-grid">
              {results.data.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
