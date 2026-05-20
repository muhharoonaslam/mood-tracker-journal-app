// v2
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const path = require('path')

const app = express()
const PORT = parseInt(process.env.PORT || '5000', 10)

app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:8000',
    changeOrigin: true,
    on: {
      error: (err, _req, res) => {
        res.writeHead(502, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'API unavailable', detail: err.message }))
      },
    },
  })
)

app.get('/health', async (_req, res) => {
  try {
    const http = require('http')
    await new Promise((resolve, reject) => {
      http.get('http://localhost:8000/swagger', (r) => resolve(r.statusCode)).on('error', reject)
    }).then(status => res.json({ express: 'ok', port: PORT, dotnet: status }))
  } catch (e) {
    res.json({ express: 'ok', port: PORT, dotnet: 'unreachable', error: e.message })
  }
})

app.use(express.static(path.join(__dirname, 'mood-tracker-frontend/dist')))

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'mood-tracker-frontend/dist/index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
