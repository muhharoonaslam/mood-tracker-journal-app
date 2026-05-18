import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from './hooks/useAuth'
import { useMoods } from './hooks/useMoods'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import MoodForm from './components/MoodForm'
import MoodTimeline from './components/MoodTimeline'
import ErrorMessage from './components/ErrorMessage'
import './App.css'

export default function App() {
  const { user, token, login, register, logout, isAuthenticated } = useAuth()
  const { entries, loading, error, submitting, fetchEntries, submitMood } = useMoods()

  const [showRegister, setShowRegister] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [activeEntryId, setActiveEntryId] = useState(null)

  // Fetch entries once authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchEntries(token)
    }
  }, [isAuthenticated, token, fetchEntries])

  // ── Auth handlers ──

  async function handleLogin(email, password) {
    setAuthError(null)
    try {
      await login(email, password)
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Login failed. Please check your credentials.'
      setAuthError(msg)
      throw err
    }
  }

  async function handleRegister(email, password) {
    setAuthError(null)
    try {
      await register(email, password)
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Registration failed. Please try again.'
      setAuthError(msg)
      throw err
    }
  }

  function switchToRegister() {
    setAuthError(null)
    setShowRegister(true)
  }

  function switchToLogin() {
    setAuthError(null)
    setShowRegister(false)
  }

  // ── Mood handlers ──

  async function handleMoodSubmit(moodType, note) {
    await submitMood(token, moodType, note)
    await fetchEntries(token)
  }

  const handleEntryClick = useCallback((id) => {
    setActiveEntryId((prev) => (prev === id ? null : id))
  }, [])

  // ── Unauthenticated view ──

  if (!isAuthenticated) {
    return showRegister ? (
      <RegisterForm
        onRegister={handleRegister}
        onSwitch={switchToLogin}
        error={authError}
      />
    ) : (
      <LoginForm
        onLogin={handleLogin}
        onSwitch={switchToRegister}
        error={authError}
      />
    )
  }

  // ── Authenticated view ──

  return (
    <div className="app-root">
      {/* ── Header ── */}
      <header className="app-header">
        <span className="app-header-brand">
          Paper <span>&amp;</span> Ink Journal
        </span>
        <div className="app-header-right">
          {user?.email && (
            <span className="app-header-email">{user.email}</span>
          )}
          <button type="button" className="app-logout-btn" onClick={logout}>
            Sign Out
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="app-main">
        {/* Mood entry section */}
        <section className="mood-section" aria-label="Log your mood">
          <h2 className="section-heading">How are you feeling?</h2>
          <div className="section-rule" />
          <MoodForm
            onSubmit={handleMoodSubmit}
            submitting={submitting}
            error={error}
          />
        </section>

        {/* Timeline section */}
        <section className="timeline-section" aria-label="Recent mood entries">
          <h2 className="section-heading">Recent Entries</h2>
          <div className="section-rule" />
          {!error && (
            <MoodTimeline
              entries={entries}
              loading={loading}
              activeEntryId={activeEntryId}
              onEntryClick={handleEntryClick}
            />
          )}
          {error && !submitting && (
            <ErrorMessage message={error} />
          )}
        </section>
      </main>
    </div>
  )
}
