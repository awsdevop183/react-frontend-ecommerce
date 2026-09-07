import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

/**
 * Node 26 defines a built-in `localStorage` global that stays inert unless the
 * process is started with --localstorage-file. It shadows the implementation
 * jsdom would otherwise install, so `window.localStorage` is undefined here
 * even though the DOM is present. Browsers are unaffected; this only needs
 * fixing for tests.
 */
if (!window.localStorage) {
  const store = new Map()
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
      clear: () => store.clear(),
      key: (index) => [...store.keys()][index] ?? null,
      get length() {
        return store.size
      },
    },
  })
}

// jsdom has no layout engine, so scrollTo is not implemented and logs a noisy
// "Not implemented" error on every route change. <ScrollToTop> calls it.
window.scrollTo = () => {}

afterEach(() => {
  // The cart persists to localStorage, so one test must not leak into the next.
  window.localStorage.clear()
})
