import React from 'react'
import MoodCanvasFace from './MoodCanvasFace'

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

/**
 * A single journal card in the mood timeline.
 * @param {{
 *   entry: { id: string|number, moodType: string, timestampUtc: string, note: string },
 *   index: number,
 *   isActive: boolean,
 *   onClick: (id: string|number) => void
 * }} props
 */
export default function TimelineEntry({ entry, index = 0, isActive, onClick }) {
  const { id, moodType, timestampUtc, note } = entry
  const mood = moodType || 'Neutral'

  // Alternate slight rotation: even = tilt left, odd = tilt right
  const rotation = index % 2 === 0 ? '-0.5deg' : '0.5deg'

  function handleClick() {
    if (onClick) onClick(id)
  }

  return (
    <article
      className="timeline-card"
      style={{ transform: `rotate(${rotation})` }}
      onClick={handleClick}
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

      {note && (
        <div className="card-note-area">{note}</div>
      )}
    </article>
  )
}
