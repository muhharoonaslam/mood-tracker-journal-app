import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from './hooks/useAuth'
import { useMoods } from './hooks/useMoods'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import MoodForm from './components/MoodForm'
import MoodTimeline from './components/MoodTimeline'
import StreakCard from './components/StreakCard'
import ReflectionsTrend from './components/ReflectionsTrend'
import SummaryView from './components/SummaryView'
import BottomNav from './components/BottomNav'
import './App.css'

export default function App() {
  const { user, token, login, register, logout, isAuthenticated } = useAuth()
  const { entries, loading, error, submitting, fetchEntries, submitMood } = useMoods()

  const [showRegister, setShowRegister] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [view, setView] = useState('timeline') // 'timeline' | 'log' | 'summary'

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchEntries(token)
    }
  }, [isAuthenticated, token, fetchEntries])

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

  async function handleMoodSubmit(moodType, note) {
    await submitMood(token, moodType, note)
    await fetchEntries(token)
    setView('timeline')
  }

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

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-header-title">My Journal</span>
        <div className="app-header-icons">
          {user?.email && (
            <span className="app-header-email">{user.email}</span>
          )}
          <button type="button" className="app-logout-btn" onClick={logout}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="app-content">
        {view === 'timeline' && (
          <div className="timeline-view">
            <h2 className="section-title">Recent Entries</h2>
            <div className="section-underline" />
            <MoodTimeline entries={entries} loading={loading} />
            <ReflectionsTrend entries={entries} />
            <StreakCard entries={entries} />
          </div>
        )}

        {view === 'log' && (
          <MoodForm
            onSubmit={handleMoodSubmit}
            submitting={submitting}
            error={error}
            onBack={() => setView('timeline')}
          />
        )}

        {view === 'summary' && (
          <SummaryView entries={entries} />
        )}
      </main>

      {/* FAB — only on timeline view */}
      {view === 'timeline' && (
        <button
          className="fab"
          aria-label="Log new mood"
          onClick={() => setView('log')}
        >
          +
        </button>
      )}

      <BottomNav view={view} setView={setView} />
    </div>
  )
}
