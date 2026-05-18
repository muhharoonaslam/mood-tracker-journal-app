import React from 'react'
import MoodCanvasFace from './MoodCanvasFace'

/**
 * Renders tally marks in groups of 5 using ASCII notation.
 * e.g. 6 → "||||/ |"   3 → "|||"
 */
function makeTally(n) {
  if (n === 0) return '—'
  let str = ''
  let rem = n
  while (rem >= 5) {
    str += '||||/ '
    rem -= 5
  }
  str += '|'.repeat(rem)
  return str.trim()
}

function formatLedgerDate(utcString) {
  if (!utcString) return ''
  try {
    const d = new Date(utcString)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
    })
  } catch {
    return utcString
  }
}

/**
 * Month in Review summary page.
 * @param {{ entries: object[] }} props
 */
export default function SummaryView({ entries }) {
  const safeEntries = Array.isArray(entries) ? entries : []

  // Filter to current calendar month
  const now = new Date()
  const thisMonth = safeEntries.filter((e) => {
    if (!e.timestampUtc) return false
    const d = new Date(e.timestampUtc)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const moodCounts = { Happy: 0, Neutral: 0, Sad: 0 }
  thisMonth.forEach((e) => {
    const m = e.moodType
    if (m in moodCounts) moodCounts[m]++
  })

  // Sort all entries by date descending for ledger
  const sorted = [...safeEntries].sort(
    (a, b) => new Date(b.timestampUtc) - new Date(a.timestampUtc)
  )

  return (
    <div className="summary-view">
      <h2 className="section-title">Month in Review</h2>
      <div className="section-underline" />

      <div className="mood-tally-row">
        {['Happy', 'Neutral', 'Sad'].map((mood) => (
          <div className="tally-card" key={mood}>
            <MoodCanvasFace mood={mood} size={50} />
            <div className="tally-card-label">{mood}</div>
            <div className="tally-marks">{makeTally(moodCounts[mood])}</div>
          </div>
        ))}
      </div>

      <h3 className="ledger-title">Daily Ledger</h3>

      {sorted.length === 0 ? (
        <p className="timeline-empty">No entries yet — start journaling!</p>
      ) : (
        <div className="ledger-table">
          <div className="ledger-header">
            <span>Date</span>
            <span>Mood</span>
            <span>Tally</span>
          </div>
          {sorted.map((e) => (
            <div className="ledger-row" key={e.id}>
              <span>{formatLedgerDate(e.timestampUtc)}</span>
              <span>{e.moodType}</span>
              <span>|</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
