/**
 * HTTP client.
 *
 * The app talks to this module, never to `fetch` directly. Today there is no
 * backend, so `isMockMode` is true and the api/*.js modules answer from the
 * local seed catalog. When the backend episode lands, set VITE_API_BASE_URL
 * (or leave it empty and let the Vite dev proxy forward /api) and every call
 * becomes a real HTTP request with no component changes.
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

/** No API base configured means "serve everything from the seed catalog". */
export const isMockMode = import.meta.env.VITE_USE_MOCK_API !== 'false' && !BASE_URL

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export function buildQuery(params = {}) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export async function request(path, { method = 'GET', body, signal, headers } = {}) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : null),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (cause) {
    if (cause?.name === 'AbortError') throw cause
    throw new ApiError('Could not reach the server. Check your connection.', 0, cause)
  }

  if (response.status === 204) return null

  const payload = response.headers.get('content-type')?.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    throw new ApiError(payload?.message || `Request failed (${response.status})`, response.status, payload)
  }

  return payload
}
