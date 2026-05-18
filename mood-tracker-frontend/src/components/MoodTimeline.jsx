import React, { useRef } from 'react'
import TimelineEntry from './TimelineEntry'
import LoadingState from './LoadingState'

export default function MoodTimeline({ entries, loading, activeEntryId, onEntryClick }) {
  const sliderRef = useRef(null)
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 })

  function onMouseDown(e) {
    const el = sliderRef.current
    drag.current = { active: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft }
    el.style.cursor = 'grabbing'
    el.style.userSelect = 'none'
  }

  function onMouseMove(e) {
    if (!drag.current.active) return
    e.preventDefault()
    const el = sliderRef.current
    const x = e.pageX - el.offsetLeft
    el.scrollLeft = drag.current.scrollLeft - (x - drag.current.startX)
  }

  function endDrag() {
    drag.current.active = false
    const el = sliderRef.current
    if (el) { el.style.cursor = 'grab'; el.style.userSelect = '' }
  }

  if (loading) return <LoadingState text="Loading entries" />

  if (!entries || entries.length === 0) {
    return <p className="timeline-empty">No entries yet — tap + to log your first mood.</p>
  }

  return (
    <div
      className="timeline-cards"
      role="list"
      aria-label="Mood entries"
      ref={sliderRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      style={{ cursor: 'grab' }}
    >
      {entries.map((entry, index) => (
        <TimelineEntry
          key={entry.id}
          entry={entry}
          index={index}
          isActive={entry.id === activeEntryId}
          onClick={onEntryClick}
        />
      ))}
    </div>
  )
}
