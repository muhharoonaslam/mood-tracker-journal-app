// v2
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const path = require('path')

const app = express()
const PORT = parseInt(process.env.PORT || '5000', 10)

app.use(
  createProxyMiddleware({
    target: 'http://localhost:8000',
    changeOrigin: true,
    pathFilter: '/api',
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
  const fs = require('fs')
  let dotnetLog = ''
  try { dotnetLog = fs.readFileSync('/tmp/dotnet.log', 'utf8').slice(-2000) } catch (e) { dotnetLog = 'log read error: ' + e.message }
  const outDir = '/home/runner/workspace/mood-tracker-api/out'
  let outFiles = []
  try { outFiles = fs.readdirSync(outDir) } catch (e) { outFiles = ['read error: ' + e.message] }
  res.json({
    express: 'ok',
    port: PORT,
    api_swagger: swagger,
    out_dir_files: outFiles,
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
