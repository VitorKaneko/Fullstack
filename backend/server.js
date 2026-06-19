import express from 'express'
import compression from 'compression'
import authRoutes from './src/routes/auth.routes.js'
import teamRoutes from './src/routes/teams.routes.js'
import { logger } from './src/config/logger.js'

const app = express()

// ── CORS manual (sem biblioteca) ──
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// ── Headers de segurança manuais ──
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff')
  res.header('X-Frame-Options', 'DENY')
  next()
})

// ── Compressão de respostas ──
app.use(compression())

app.use(express.json({ limit: '10kb' }))

// ── Rotas da API ──
app.use('/auth', authRoutes)
app.use('/teams', teamRoutes)

// ── Rota de saúde ──
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  logger.info(`Servidor HTTP rodando na porta ${PORT}`)
})