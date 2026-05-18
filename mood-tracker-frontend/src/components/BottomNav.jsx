import React from 'react'

/**
 * Fixed bottom navigation bar.
 * @param {{ view: string, setView: (view: string) => void }} props
 */
export default function BottomNav({ view, setView }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <button
        className={`nav-item${view === 'timeline' ? ' active' : ''}`}
        onClick={() => setView('timeline')}
        aria-label="Journal"
        aria-current={view === 'timeline' ? 'page' : undefined}
      >
        <span className="nav-item-icon" aria-hidden="true">📔</span>
        <span>Journal</span>
      </button>

      <button
        className={`nav-item${view === 'log' ? ' active' : ''}`}
        onClick={() => setView('log')}
        aria-label="Log mood"
        aria-current={view === 'log' ? 'page' : undefined}
      >
        <span className="nav-item-icon" aria-hidden="true">✏</span>
        <span>Log</span>
      </button>

      <button
        className={`nav-item${view === 'summary' ? ' active' : ''}`}
        onClick={() => setView('summary')}
        aria-label="Summary"
        aria-current={view === 'summary' ? 'page' : undefined}
      >
        <span className="nav-item-icon" aria-hidden="true">📊</span>
        <span>Summary</span>
      </button>
    </nav>
  )
}
