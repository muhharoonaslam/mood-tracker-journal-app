import React, { useState, useCallback } from 'react'
import MoodCanvasFace from './MoodCanvasFace'

const MOOD_COLORS = { Happy: '#E8913A', Neutral: '#7A8B69', Sad: '#6B8CAE' }

function formatCardDate(utcString) {
  if (!utcString) return ''
  try {
    const d = new Date(utcString)
    const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    const day = d.getDate()
    return `${month} ${day}`
  } catch {
    return utcString
  }
}

export default function TimelineEntry({ entry, index = 0, isActive, onClick }) {
  const { id, moodType, timestampUtc, note } = entry
  const mood = moodType || 'Neutral'
  const [pulsing, setPulsing] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const moodColor = MOOD_COLORS[mood] || MOOD_COLORS.Neutral
  const rotation = index % 2 === 0 ? '-0.5deg' : '0.5deg'
  const moodClass = `mood-${mood.toLowerCase()}`

  const handleClick = useCallback(() => {
    if (onClick) onClick(id)
    setPulsing(false)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPulsing(true))
    })
  }, [id, onClick])

  const handleViewMore = useCallback((e) => {
    e.stopPropagation()
    setExpanded(true)
  }, [])

  return (
    <>
      <article
        className={`timeline-card ${moodClass} ${pulsing ? 'entry-pulse' : ''}`}
        style={{ transform: `rotate(${rotation})` }}
        onClick={handleClick}
        onAnimationEnd={() => setPulsing(false)}
        role="button"
        tabIndex={0}
        aria-pressed={isActive}
        aria-label={`${mood} mood on ${formatCardDate(timestampUtc)}`}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
      >
        <div className="card-header">
          <span className="card-date">{formatCardDate(timestampUtc)}</span>
          <span className="card-heart" aria-hidden="true">♥</span>
        </div>

        <div className="card-face-center">
          <MoodCanvasFace mood={mood} size={90} />
        </div>

        <div
          className="card-mood-label"
          style={{ color: moodColor }}
        >
          {mood}
        </div>

        {note && (
          <>
            <div className="card-note-area card-note-truncated">{note}</div>
            <button
              className="card-view-more"
              onClick={handleViewMore}
              style={{ color: moodColor }}
            >
              View more ›
            </button>
          </>
        )}
      </article>

      {expanded && (
        <div
          className="note-modal-backdrop"
          onClick={() => setExpanded(false)}
        >
          <div
            className="note-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="note-modal-header"
              style={{ borderBottomColor: moodColor }}
            >
              <div className="note-modal-meta">
                <span className="note-modal-mood" style={{ color: moodColor }}>
                  {mood}
                </span>
                <span className="note-modal-date">
                  {formatCardDate(timestampUtc)}
                </span>
              </div>
              <button
                className="note-modal-close"
                onClick={() => setExpanded(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="note-modal-body">{note}</div>
          </div>
        </div>
      )}
    </>
  )
}
