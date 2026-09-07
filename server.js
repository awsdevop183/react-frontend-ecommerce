/**
 * Production server for Azure App Service (Linux, Node runtime).
 *
 * App Service does NOT serve a Vite `dist/` folder on its own, and a plain
 * static host will 404 on a deep link like /dashboard after a refresh. This
 * server does two jobs:
 *   1. serve the hashed static assets with long cache headers
 *   2. fall back to index.html so client-side routing works
 *
 * Startup command in App Service:  node server.js
 */
import express from 'express'
import compression from 'compression'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, 'dist')

const app = express()
const port = process.env.PORT || 8080

app.disable('x-powered-by')
app.use(compression())

// Health endpoint. Point App Service > Configuration > Health check here.
app.get('/healthz', (req, res) => {
  res.json({
    status: 'healthy',
    uptimeSeconds: Math.round(process.uptime()),
    node: process.version,
    environment: process.env.VITE_ENVIRONMENT || 'unknown',
    buildNumber: process.env.BUILD_BUILDNUMBER || 'unknown',
    instance: process.env.WEBSITE_INSTANCE_ID?.slice(0, 8) || 'local',
    timestamp: new Date().toISOString(),
  })
})

// Hashed assets are immutable; index.html must never be cached.
app.use(
  express.static(dist, {
    index: false,
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache')
      } else {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      }
    },
  }),
)

// SPA fallback - every unmatched GET returns the app shell.
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache')
  res.sendFile(path.join(dist, 'index.html'))
})

app.listen(port, () => {
  console.log(`Serving ${dist} on port ${port}`)
})
