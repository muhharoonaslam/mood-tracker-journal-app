import React, { useState } from 'react'
import ErrorMessage from './ErrorMessage'

/**
 * Login form — Paper & Ink Neo-Brutalism design.
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

  function fillTestAccount() {
    setEmail('test@example.com')
    setPassword('password123')
  }

  return (
    <div className="auth-page">
      <h1 className="auth-title">My Journal</h1>
      <p className="auth-subtitle">· Your private collection of thoughts ·</p>
      <div className="auth-divider-line" />

      <div className="auth-card">
        <ErrorMessage message={error} />

        <div style={{ marginBottom: '1rem', padding: '0.6rem 0.75rem', background: '#f5f0e8', border: '1px solid #c8b89a', borderRadius: '4px', fontSize: '0.8rem', color: '#6b5a45' }}>
          <strong>Test account:</strong> test@example.com / password123{' '}
          <span
            onClick={fillTestAccount}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fillTestAccount()}
            style={{ cursor: 'pointer', textDecoration: 'underline', color: '#4a3728' }}
          >
            (fill in)
          </span>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-email">
              Identify Yourself (Email)
            </label>
            <input
              id="login-email"
              className="auth-input"
              type="email"
              autoComplete="email"
              placeholder="e.g. wanderer@paper.ink"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="login-password">
              Secret Passcode
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
            className="auth-btn-primary"
            disabled={loading || !email.trim() || !password}
          >
            {loading ? 'Unlocking…' : 'Unlock'}
          </button>
        </form>
      </div>

      <p className="auth-switch">
        New diarist?{' '}
        <span className="auth-switch-link" onClick={onSwitch} role="button" tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSwitch()}>
          Start a new ledger
        </span>
      </p>

      <div className="auth-footer">
        🔒 End-to-end encrypted personal reflections.
      </div>
    </div>
  )
}
