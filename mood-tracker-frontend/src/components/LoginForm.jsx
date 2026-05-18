import React, { useState } from 'react'
import ErrorMessage from './ErrorMessage'

/**
 * Login form with Paper & Ink styling.
 * @param {{ onLogin: (email, password) => Promise<void>, onSwitch: () => void, error: string|null }} props
 */
export default function LoginForm({ onLogin, onSwitch, error }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim() || !password) return
    setLoading(true)
    try {
      await onLogin(email.trim(), password)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Continue your journal</p>
        <div className="auth-divider" />

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              className="auth-input"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className="auth-input"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading || !email.trim() || !password}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Don&rsquo;t have an account?{' '}
          <button type="button" className="auth-switch-btn" onClick={onSwitch}>
            Register
          </button>
        </p>
      </div>
    </div>
  )
}
