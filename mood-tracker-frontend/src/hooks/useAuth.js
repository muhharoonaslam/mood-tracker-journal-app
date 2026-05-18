import { useState, useCallback } from 'react'
import * as authApi from '../api/authApi'

const TOKEN_KEY = 'mood_journal_token'
const EMAIL_KEY = 'mood_journal_email'

/**
 * Decodes the email claim from a JWT without verifying signature.
 * Falls back to the stored email if decoding fails.
 */
function decodeEmail(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.email || payload.sub || null
  } catch {
    return null
  }
}

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null)
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    if (!storedToken) return null
    return {
      email:
        localStorage.getItem(EMAIL_KEY) ||
        decodeEmail(storedToken) ||
        'user',
    }
  })

  const persistSession = useCallback((tok, email) => {
    localStorage.setItem(TOKEN_KEY, tok)
    if (email) localStorage.setItem(EMAIL_KEY, email)
    setToken(tok)
    setUser({ email: email || decodeEmail(tok) || 'user' })
  }, [])

  const login = useCallback(
    async (email, password) => {
      const data = await authApi.login(email, password)
      persistSession(data.token, email)
      return data
    },
    [persistSession],
  )

  const register = useCallback(
    async (email, password) => {
      const data = await authApi.register(email, password)
      // Some APIs return a token on register; handle both cases
      if (data.token) {
        persistSession(data.token, email)
      }
      return data
    },
    [persistSession],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EMAIL_KEY)
    setToken(null)
    setUser(null)
  }, [])

  return {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: Boolean(token),
  }
}
