import React from 'react'
import TimelineEntry from './TimelineEntry'
import LoadingState from './LoadingState'

/**
 * Vertical list of mood entry cards.
 * @param {{
 *   entries: object[],
 *   loading: boolean,
 *   activeEntryId?: string|number|null,
 *   onEntryClick?: (id: string|number) => void
 * }} props
 */
export default function MoodTimeline({ entries, loading, activeEntryId, onEntryClick }) {
  if (loading) {
    return <LoadingState text="Loading entries" />
  }

  if (!entries || entries.length === 0) {
    return (
      <p className="timeline-empty">
        No entries yet — tap + to log your first mood.
      </p>
    )
  }

  return (
    <div className="timeline-cards" role="list" aria-label="Mood entries">
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
