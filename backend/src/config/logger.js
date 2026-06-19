import fs from 'fs'
import path from 'path'

const LOG_DIR = path.resolve('logs')
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true })
}

function write(level, message, meta = {}) {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  }) + '\n'

  fs.appendFile(path.join(LOG_DIR, 'combined.log'), entry, () => {})
  if (level === 'error') {
    fs.appendFile(path.join(LOG_DIR, 'error.log'), entry, () => {})
  }
  console.log(entry.trim())
}

export const logger = {
  info:  (msg, meta) => write('info', msg, meta),
  warn:  (msg, meta) => write('warn', msg, meta),
  error: (msg, meta) => write('error', msg, meta),
}