import React from 'react'

export default function BottomNav({ view, setView }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <button
        className={`nav-item${view === 'timeline' ? ' active' : ''}`}
        onClick={() => setView('timeline')}
        aria-label="Journal"
        aria-current={view === 'timeline' ? 'page' : undefined}
      >
        <span className="nav-icon-journal" aria-hidden="true">
          <span className="nav-icon-journal-spine" />
          <span className="nav-icon-journal-lines">
            <span /><span /><span />
          </span>
        </span>
        <span>Journal</span>
      </button>

      <button
        className={`nav-item${view === 'log' ? ' active' : ''}`}
        onClick={() => setView('log')}
        aria-label="Log mood"
        aria-current={view === 'log' ? 'page' : undefined}
      >
        <span className="nav-icon-pen" aria-hidden="true">
          <span className="nav-icon-pen-body" />
          <span className="nav-icon-pen-tip" />
        </span>
        <span>Log</span>
      </button>

      <button
        className={`nav-item${view === 'summary' ? ' active' : ''}`}
        onClick={() => setView('summary')}
        aria-label="Summary"
        aria-current={view === 'summary' ? 'page' : undefined}
      >
        <span className="nav-icon-chart" aria-hidden="true">
          <span className="nav-icon-bar" style={{ height: 8 }} />
          <span className="nav-icon-bar" style={{ height: 14 }} />
          <span className="nav-icon-bar" style={{ height: 10 }} />
          <span className="nav-icon-bar" style={{ height: 18 }} />
        </span>
        <span>Summary</span>
      </button>
    </nav>
  )
}
