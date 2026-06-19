import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { UserModel } from '../models/UserModel.js'
import { blocklist } from '../config/cache.js'
import { logger } from '../config/logger.js'

const router = Router()

const loginAttempts = new Map()
function rateLimitLogin(req, res, next) {
  const ip = req.ip
  const now = Date.now()
  const record = loginAttempts.get(ip)

  if (record && now < record.resetAt) {
    if (record.count >= 5) {
      logger.warn('Rate limit de login atingido', { ip })
      return res.status(429).json({ error: 'Muitas tentativas. Aguarde 15 minutos.' })
    }
    record.count++
  } else {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 })
  }
  next()
}

function validateLogin(req, res, next) {
  const { email, password } = req.body
  const errors = []

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'E-mail inválido.' })
  }
  if (typeof password !== 'string' || password.length < 6) {
    errors.push({ field: 'password', message: 'Senha deve ter ao menos 6 caracteres.' })
  }
  if (errors.length) return res.status(400).json({ errors })

  req.body.email = email.trim().toLowerCase()
  next()
}

router.post('/login', rateLimitLogin, validateLogin, async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await UserModel.findByEmail(email)
    if (!user) {
      logger.warn('Login: e-mail inexistente', { email, ip: req.ip })
      return res.status(401).json({ error: 'Credenciais inválidas.' })
    }
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      logger.warn('Login: senha incorreta', { email, ip: req.ip })
      return res.status(401).json({ error: 'Credenciais inválidas.' })
    }

    const jti = crypto.randomUUID()
    const token = jwt.sign(
      { userId: user.id, email: user.email, jti },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    )
    logger.info('Login bem-sucedido', { userId: user.id })
    res.status(200).json({ token, user: { id: user.id, email: user.email } })
  } catch (err) {
    logger.error('Erro interno no login', { error: err.message })
    res.status(500).json({ error: 'Erro interno do servidor.' })
  }
})

router.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(400).json({ error: 'Token não fornecido.' })
  }
  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    blocklist.add(decoded.jti, decoded.exp * 1000)
    logger.info('Logout: token invalidado', { userId: decoded.userId })
    res.status(200).json({ message: 'Logout realizado com sucesso.' })
  } catch {
    res.status(401).json({ error: 'Token inválido.' })
  }
})

export default router