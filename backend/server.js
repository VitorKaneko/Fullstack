import express from 'express'
import https from 'https'
import fs from 'fs'
import path from 'path'
import compression from 'compression'
import authRoutes from './src/routes/auth.routes.js'
import teamRoutes from './src/routes/teams.routes.js'
import { logger } from './src/config/logger.js'

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff')
  res.header('X-Frame-Options', 'DENY')
  res.header('Strict-Transport-Security', 'max-age=31536000')
  next()
})

//compressão de respostas 
app.use(compression())

app.use(express.json({ limit: '10kb' }))

app.use('/auth', authRoutes)
app.use('/teams', teamRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

//express static
const FRONTEND_DIST = path.resolve('../frontend/dist')
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST))
  app.get('*', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'))
  })
}

const sslOptions = {
  key:  fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
}

//servidor HTTPS com certificado
const PORT = process.env.PORT || 3001
https.createServer(sslOptions, app).listen(PORT, () => {
  logger.info(`Servidor HTTPS rodando na porta ${PORT}`)
})