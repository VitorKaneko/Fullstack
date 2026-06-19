import pg from 'pg'
import { logger } from './logger.js'

delete pg.native

export const pool = new pg.Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

//pool de conexões com tratamento de erros
pool.on('error', (err) => {
  logger.error('Erro inesperado no pool de conexões', { error: err.message })
})