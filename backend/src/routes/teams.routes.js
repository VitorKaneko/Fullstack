import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { TeamModel } from '../models/TeamModel.js'
import { cache, blocklist } from '../config/cache.js'
import { logger } from '../config/logger.js'

const router = Router()

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido.' })
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET)
    if (blocklist.has(decoded.jti)) {
      return res.status(401).json({ error: 'Sessão encerrada. Faça login novamente.' })
    }
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' })
  }
}

function sanitize(str) {
  return String(str).trim().replace(/[<>]/g, '')
}

//padrão rest
router.get('/search', authenticate, async (req, res) => {
  const name = sanitize(req.query.name || '')
  if (name.length < 3) {
    return res.status(400).json({ errors: [{ field: 'name', message: 'Mínimo 3 caracteres.' }] })
  }

  const cacheKey = `teams:search:${name.toLowerCase()}`
  const cached = cache.get(cacheKey)
  if (cached) {
    logger.info('Cache hit', { query: name, userId: req.user.userId })
    return res.status(200).json({ source: 'cache', teams: cached })
  }

  try {
    const teams = await TeamModel.searchByName(name) // query parametrizada no model
    cache.set(cacheKey, teams, 300) // TTL 5 min
    logger.info('Busca realizada', { query: name, userId: req.user.userId, results: teams.length })
    res.status(200).json({ source: 'database', teams })
  } catch (err) {
    logger.error('Erro na busca', { error: err.message })
    res.status(500).json({ error: 'Erro ao buscar times.' })
  }
})

//padrão rest
router.post('/', authenticate, async (req, res) => {
  const strTeam = sanitize(req.body.strTeam || '')
  const strCountry = sanitize(req.body.strCountry || '')
  const errors = []

  if (strTeam.length < 2) errors.push({ field: 'strTeam', message: 'Nome do time obrigatório.' })
  if (!strCountry) errors.push({ field: 'strCountry', message: 'País obrigatório.' })
  if (errors.length) return res.status(400).json({ errors })

  try {
    const team = await TeamModel.create({
      strTeam,
      strCountry,
      strStadium: sanitize(req.body.strStadium || ''),
      strTeamBadge: sanitize(req.body.strTeamBadge || ''),
      createdBy: req.user.userId,
    })
    cache.del(`teams:search:${strTeam.toLowerCase()}`) // invalida cache relacionado
    logger.info('Time inserido', { teamName: strTeam, userId: req.user.userId })
    res.status(201).json({ message: 'Time inserido com sucesso.', team })
  } catch (err) {
    logger.error('Erro ao inserir time', { error: err.message })
    res.status(500).json({ error: 'Erro ao inserir time.' })
  }
})

export default router