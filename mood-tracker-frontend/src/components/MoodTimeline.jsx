import React from 'react'
import TimelineEntry from './TimelineEntry'
import LoadingState from './LoadingState'

/**
 * Horizontally scrolling list of mood entries.
 * @param {{
 *   entries: object[],
 *   loading: boolean,
 *   activeEntryId: string|number|null,
 *   onEntryClick: (id: string|number) => void
 * }} props
 */
export default function MoodTimeline({ entries, loading, activeEntryId, onEntryClick }) {
  if (loading) {
    return <LoadingState text="Loading entries" />
  }

  if (!entries || entries.length === 0) {
    return (
      <p className="timeline-empty">
        No entries yet. Log your first mood above.
      </p>
    )
  }

  return (
    <div className="timeline-scroll" role="list" aria-label="Mood entries">
      {entries.map((entry) => (
        <TimelineEntry
          key={entry.id}
          entry={entry}
          isActive={entry.id === activeEntryId}
          onClick={onEntryClick}
        />
      ))}
    </div>
  )
}
