import React, { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)
const API_URL = import.meta.env.VITE_API_URL ?? ''
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  const login = useCallback(async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      const message =
        data.error ||
        data.errors?.[0]?.message ||
        'Falha na autenticação. Tente novamente.'
      throw new Error(message)
    }

    setUser(data.user)
    setToken(data.token)
  }, [])
  const logout = useCallback(async () => {
    try {
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      }
    } finally {
      setUser(null)
      setToken(null)
    }
  }, [token])

  const contextValue = {
    user,
    token,
    login,
    logout,
    isAuthenticated: Boolean(user && token),
    apiUrl: API_URL,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}