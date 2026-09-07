import { useEffect, useState } from 'react'

/**
 * Runs an async loader and tracks its lifecycle.
 *
 * Aborts in flight when dependencies change or the component unmounts, so a
 * slow response cannot overwrite a newer one - the classic race that makes
 * search-as-you-type flicker between old and new results.
 *
 * @param loader  (signal) => Promise<T>
 * @param deps    dependency list, same rules as useEffect
 */
export function useAsync(loader, deps = []) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null })

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    setState((prev) => ({ ...prev, status: 'loading', error: null }))

    loader(controller.signal)
      .then((data) => {
        if (active) setState({ status: 'success', data, error: null })
      })
      .catch((error) => {
        if (!active || error?.name === 'AbortError') return
        setState({ status: 'error', data: null, error })
      })

    return () => {
      active = false
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return {
    ...state,
    isLoading: state.status === 'loading',
    isError: state.status === 'error',
  }
}
