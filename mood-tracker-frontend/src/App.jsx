import React, { useState, useEffect } from 'react'
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
import DesktopSidebar from './components/DesktopSidebar'
import './App.css'

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isDesktop
}

export default function App() {
  const { user, token, login, register, logout, isAuthenticated } = useAuth()
  const { entries, loading, error, submitting, fetchEntries, submitMood } = useMoods()

  const [showRegister, setShowRegister] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [view, setView] = useState('timeline') // 'timeline' | 'log' | 'summary'
  const [activeEntryId, setActiveEntryId] = useState(null)
  const isDesktop = useIsDesktop()

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
    if (!isDesktop) setView('timeline')
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

  const timelineContent = (
    <div className="timeline-view">
      <h2 className="section-title">Recent Entries</h2>
      <div className="section-underline" />
      {isDesktop ? (
        /* Desktop: entries grid + right-column widgets */
        <div className="desktop-main-grid">
          <MoodTimeline
            entries={entries}
            loading={loading}
            activeEntryId={activeEntryId}
            onEntryClick={(id) => setActiveEntryId(prev => prev === id ? null : id)}
          />
          <div className="desktop-widgets">
            <ReflectionsTrend entries={entries} />
            <StreakCard entries={entries} />
          </div>
        </div>
      ) : (
        /* Mobile: stacked */
        <>
          <MoodTimeline
            entries={entries}
            loading={loading}
            activeEntryId={activeEntryId}
            onEntryClick={(id) => setActiveEntryId(prev => prev === id ? null : id)}
          />
          <ReflectionsTrend entries={entries} />
          <StreakCard entries={entries} />
        </>
      )}
    </div>
  )

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-header-title">My Journal</span>
        <div className="app-header-icons">
          {user?.email && !isDesktop && (
            <span className="app-header-email">{user.email}</span>
          )}
          {!isDesktop && (
            <button type="button" className="app-logout-btn" onClick={logout}>
              Sign Out
            </button>
          )}
        </div>
      </header>

      {/* Desktop sidebar — hidden on mobile via CSS */}
      {isDesktop && (
        <DesktopSidebar
          view={view}
          setView={setView}
          user={user}
          logout={logout}
          onMoodSubmit={handleMoodSubmit}
          submitting={submitting}
          error={error}
        />
      )}

      <main className="app-content">
        {/* Desktop always shows timeline or summary (form is in sidebar) */}
        {isDesktop ? (
          view === 'summary'
            ? <SummaryView entries={entries} />
            : timelineContent
        ) : (
          <>
            {view === 'timeline' && timelineContent}
            {view === 'log' && (
              <MoodForm
                onSubmit={handleMoodSubmit}
                submitting={submitting}
                error={error}
                onBack={() => setView('timeline')}
              />
            )}
            {view === 'summary' && <SummaryView entries={entries} />}
          </>
        )}
      </main>

      {/* Mobile-only: FAB + bottom nav */}
      {!isDesktop && view === 'timeline' && (
        <button className="fab" aria-label="Log new mood" onClick={() => setView('log')}>
          +
        </button>
      )}
      {!isDesktop && <BottomNav view={view} setView={setView} />}
    </div>
  )
}
