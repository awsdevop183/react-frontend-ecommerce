import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Browsers keep the scroll position across client-side navigations. Reset it. */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
