import React, { useState } from 'react'
import MoodSelector from './MoodSelector'
import ErrorMessage from './ErrorMessage'

const MAX_NOTE = 300

/**
 * Form to log a new mood entry.
 * @param {{
 *   onSubmit: (moodType: string, note: string) => Promise<void>,
 *   submitting: boolean,
 *   error: string|null
 * }} props
 */
export default function MoodForm({ onSubmit, submitting, error }) {
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState('')

  const charCount = note.length
  const nearLimit = charCount >= MAX_NOTE * 0.8
  const atLimit = charCount >= MAX_NOTE

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedMood || submitting) return
    await onSubmit(selectedMood, note.trim())
    // Reset form on success
    setSelectedMood(null)
    setNote('')
  }

  return (
    <form className="mood-form" onSubmit={handleSubmit} noValidate>
      <MoodSelector selectedMood={selectedMood} onSelect={setSelectedMood} />

      <ErrorMessage message={error} />

      <div>
        <label className="note-field-label" htmlFor="mood-note">
          Journal Note <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
        </label>
        <textarea
          id="mood-note"
          className="note-input"
          placeholder="What's on your mind today…"
          value={note}
          maxLength={MAX_NOTE}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          disabled={submitting}
        />
        <p
          className={`note-char-count ${atLimit ? 'at-limit' : nearLimit ? 'near-limit' : ''}`}
          aria-live="polite"
        >
          {charCount} / {MAX_NOTE}
        </p>
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={!selectedMood || submitting}
      >
        {submitting ? 'Saving…' : 'Log Mood'}
      </button>
    </form>
  )
}
