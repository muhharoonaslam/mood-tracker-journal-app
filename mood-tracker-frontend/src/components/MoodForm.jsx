import React, { useState } from 'react'
import MoodCanvasFace from './MoodCanvasFace'
import ErrorMessage from './ErrorMessage'

const MAX_NOTE = 500
const MOODS = ['Happy', 'Neutral', 'Sad']

function formatCurrentDate() {
  const now = new Date()
  return now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Log view — mood entry form with date stamp and ruled textarea.
 * @param {{
 *   onSubmit: (moodType: string, note: string) => Promise<void>,
 *   submitting: boolean,
 *   error: string|null,
 *   onBack: () => void
 * }} props
 */
export default function MoodForm({ onSubmit, submitting, error, onBack }) {
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedMood || submitting) return
    await onSubmit(selectedMood, note.trim())
    setSelectedMood(null)
    setNote('')
  }

  return (
    <div className="log-view">
      <button type="button" className="log-back" onClick={onBack}>
        ← Back
      </button>

      <div className="log-date-stamp">{formatCurrentDate()}</div>

      <p className="log-question">How are you feeling?</p>

      <div className="mood-cards-row">
        {MOODS.map((mood) => (
          <button
            key={mood}
            type="button"
            className={`mood-card${selectedMood === mood ? ' selected' : ''}`}
            onClick={() => setSelectedMood(mood)}
            aria-pressed={selectedMood === mood}
          >
            <MoodCanvasFace
              mood={mood}
              size={70}
              fill={selectedMood === mood ? '#ffffff' : '#F0EAD6'}
            />
            <div className="mood-card-label">{mood}</div>
          </button>
        ))}
      </div>

      <h3 className="scribble-label">Scribble thoughts...</h3>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} noValidate>
        <textarea
          className="ruled-textarea"
          placeholder="Dear journal..."
          value={note}
          maxLength={MAX_NOTE}
          onChange={(e) => setNote(e.target.value)}
          disabled={submitting}
          rows={6}
        />

        <button
          type="submit"
          className="ink-it-btn"
          disabled={!selectedMood || submitting}
        >
          {submitting ? 'Inking…' : 'Ink it'}
        </button>
      </form>
    </div>
  )
}
