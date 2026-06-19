class MemoryCache {
  constructor() {
    this.store = new Map() 
  }

  set(key, value, ttlSeconds) {
    const expiresAt = Date.now() + ttlSeconds * 1000
    this.store.set(key, { value, expiresAt })
  }

  get(key) {
    const entry = this.store.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key) // expirou
      return null
    }
    return entry.value
  }

  del(key) {
    this.store.delete(key)
  }
}

export const cache = new MemoryCache()

const tokenBlocklist = new Map() 

export const blocklist = {
  add(jti, expiresAtMs) {
    tokenBlocklist.set(jti, expiresAtMs)
  },
  has(jti) {
    const exp = tokenBlocklist.get(jti)
    if (!exp) return false
    if (Date.now() > exp) {
      tokenBlocklist.delete(jti) // já expirou naturalmente, limpa
      return false
    }
    return true
  },
}