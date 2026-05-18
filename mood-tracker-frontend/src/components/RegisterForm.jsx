import React, { useState } from 'react'
import ErrorMessage from './ErrorMessage'

/**
 * Registration form with Paper & Ink styling.
 * @param {{ onRegister: (email, password) => Promise<void>, onSwitch: () => void, error: string|null }} props
 */
export default function RegisterForm({ onRegister, onSwitch, error }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim() || !password) return
    setLoading(true)
    try {
      await onRegister(email.trim(), password)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h1 className="auth-title">Begin Your Journal</h1>
        <p className="auth-subtitle">Create an account to start tracking your mood</p>
        <div className="auth-divider" />

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="register-email">
              Email
            </label>
            <input
              id="register-email"
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
            <label className="auth-label" htmlFor="register-password">
              Password
            </label>
            <input
              id="register-password"
              className="auth-input"
              type="password"
              autoComplete="new-password"
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
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <button type="button" className="auth-switch-btn" onClick={onSwitch}>
            Login
          </button>
        </p>
      </div>
    </div>
  )
}
