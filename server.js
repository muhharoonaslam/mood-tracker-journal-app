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
  const http = require('http')
  const check = (url) => new Promise((resolve) => {
    http.get(url, (r) => resolve({ status: r.statusCode })).on('error', (e) => resolve({ error: e.message }))
  })
  const [swagger, login] = await Promise.all([
    check('http://localhost:8000/swagger'),
    check('http://localhost:8000/api/auth/login'),
  ])
  const fs = require('fs')
  let dotnetLog = ''
  try { dotnetLog = fs.readFileSync('/tmp/dotnet.log', 'utf8').slice(-2000) } catch (_) {}
  res.json({
    express: 'ok',
    port: PORT,
    env_PORT: process.env.PORT,
    api_swagger: swagger,
    api_login_get: login,
    cwd: process.cwd(),
    dist_exists: fs.existsSync(require('path').join(__dirname, 'mood-tracker-frontend/dist/index.html')),
    dotnet_log: dotnetLog,
  })
})

app.use(express.static(path.join(__dirname, 'mood-tracker-frontend/dist')))

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'mood-tracker-frontend/dist/index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
