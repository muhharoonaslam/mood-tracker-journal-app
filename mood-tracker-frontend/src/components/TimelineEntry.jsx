import React, { useState, useCallback } from 'react'
import MoodCanvasFace from './MoodCanvasFace'

const DATE_FORMAT = { year: 'numeric', month: 'long', day: 'numeric' }

function formatDate(utcString) {
  if (!utcString) return ''
  try {
    return new Date(utcString).toLocaleDateString(undefined, DATE_FORMAT)
  } catch {
    return utcString
  }
}

/**
 * A single journal card in the mood timeline.
 * @param {{
 *   entry: { id: string|number, moodType: string, timestampUtc: string, note: string },
 *   isActive: boolean,
 *   onClick: (id: string|number) => void
 * }} props
 */
export default function TimelineEntry({ entry, isActive, onClick }) {
  const { id, moodType, timestampUtc, note } = entry
  const [pulsing, setPulsing] = useState(false)

  const mood = moodType || 'Neutral'
  const moodLower = mood.toLowerCase()
  const borderClass = `entry-border-${moodLower}`
  const activeClass = isActive ? 'active' : ''
  const pulseClass = pulsing ? 'entry-pulse' : ''

  const handleClick = useCallback(() => {
    onClick(id)
    // Trigger pulse animation
    setPulsing(false)
    // Use double rAF to ensure the class re-triggers if already active
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPulsing(true)
        setTimeout(() => setPulsing(false), 420)
      })
    })
  }, [id, onClick])

  return (
    <article
      className={`timeline-entry ${borderClass} ${activeClass} ${pulseClass}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={`${mood} mood on ${formatDate(timestampUtc)}`}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
    >
      <div className="entry-top">
        <MoodCanvasFace mood={mood} size={50} animated={false} />
        <div className="entry-meta">
          <p className={`entry-mood-label mood-${moodLower}`}>{mood}</p>
          <p className="entry-date">{formatDate(timestampUtc)}</p>
        </div>
      </div>

      {note ? (
        <p className="entry-note">{note}</p>
      ) : (
        <p className="entry-no-note">No note written</p>
      )}
    </article>
  )
}
