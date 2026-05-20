const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const path = require('path')

const app = express()
const PORT = parseInt(process.env.PORT || '5000', 10)

app.use(express.static(path.join(__dirname, 'mood-tracker-frontend/dist')))

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'mood-tracker-frontend/dist/index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
