import { formatPrice } from '../utils/format.js'

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
  { value: 'name', label: 'Name A–Z' },
]

const MAX_PRICE_CENTS = 80000

export default function CatalogFilters({ categories, filters, onChange, onReset, resultCount }) {
  const update = (patch) => onChange({ ...filters, ...patch })

  return (
    <aside className="filters card">
      <div className="filters-head">
        <h2>Filters</h2>
        <button type="button" className="link-muted" onClick={onReset}>
          Reset
        </button>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-search">Search</label>
        <input
          id="filter-search"
          type="search"
          value={filters.search}
          placeholder="Headphones, keyboard…"
          onChange={(event) => update({ search: event.target.value })}
        />
      </div>

      <div className="filter-group">
        <span className="filter-label">Category</span>
        <ul className="category-list">
          <li>
            <button
              type="button"
              className={filters.categoryId === '' ? 'active' : undefined}
              onClick={() => update({ categoryId: '' })}
            >
              All products
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                type="button"
                className={filters.categoryId === category.id ? 'active' : undefined}
                onClick={() => update({ categoryId: category.id })}
              >
                {category.name}
                <span className="count">{category.productCount}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-price">
          Max price <strong>{formatPrice(filters.maxPriceCents || MAX_PRICE_CENTS)}</strong>
        </label>
        <input
          id="filter-price"
          type="range"
          min="5000"
          max={MAX_PRICE_CENTS}
          step="5000"
          value={filters.maxPriceCents || MAX_PRICE_CENTS}
          onChange={(event) => update({ maxPriceCents: Number(event.target.value) })}
        />
      </div>

      <div className="filter-group">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(event) => update({ inStockOnly: event.target.checked })}
          />
          <span>In stock only</span>
        </label>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-sort">Sort by</label>
        <select
          id="filter-sort"
          value={filters.sort}
          onChange={(event) => update({ sort: event.target.value })}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {resultCount != null && <p className="filter-result-count">{resultCount} products</p>}
    </aside>
  )
}
