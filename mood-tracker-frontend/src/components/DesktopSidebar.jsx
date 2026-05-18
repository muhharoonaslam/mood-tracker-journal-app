import React from 'react'

export default function DesktopSidebar({ view, setView, user, logout, onOpenLogModal }) {
  return (
    <aside className="desktop-sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-title">My Journal</span>
        <span className="sidebar-brand-sub">Paper &amp; Ink</span>
      </div>

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

      <button className="sidebar-log-btn" onClick={onOpenLogModal}>
        + Log Mood
      </button>

      <div className="sidebar-divider" />

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
