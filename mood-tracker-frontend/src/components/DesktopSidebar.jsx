import React from 'react'
import MoodForm from './MoodForm'

/**
 * Left sidebar shown only on desktop (≥768px via CSS).
 * Contains brand, navigation, the always-visible mood form, and user info.
 */
export default function DesktopSidebar({ view, setView, user, logout, onMoodSubmit, submitting, error }) {
  return (
    <aside className="desktop-sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="sidebar-brand-title">My Journal</span>
        <span className="sidebar-brand-sub">Paper &amp; Ink</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav" aria-label="Main navigation">
        <button
          className={`sidebar-nav-item${view === 'timeline' ? ' active' : ''}`}
          onClick={() => setView('timeline')}
        >
          <span className="sidebar-nav-icon" aria-hidden="true">📔</span>
          Journal
        </button>
        <button
          className={`sidebar-nav-item${view === 'summary' ? ' active' : ''}`}
          onClick={() => setView('summary')}
        >
          <span className="sidebar-nav-icon" aria-hidden="true">📊</span>
          Summary
        </button>
      </nav>

      <div className="sidebar-divider" />

      {/* Inline mood form */}
      <div className="sidebar-form-area">
        <MoodForm
          onSubmit={onMoodSubmit}
          submitting={submitting}
          error={error}
          compact
        />
      </div>

      <div className="sidebar-divider" />

      {/* User info + logout */}
      <div className="sidebar-user">
        {user?.email && (
          <span className="sidebar-user-email">{user.email}</span>
        )}
        <button type="button" className="app-logout-btn" onClick={logout}>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
