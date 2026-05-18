import React from 'react'
import MoodCanvasFace from './MoodCanvasFace'

const MOOD_COLORS = { Happy: '#E8913A', Neutral: '#7A8B69', Sad: '#6B8CAE' }

/**
 * Tally marks grouped in fives.
 * 7 → "|||| ||"   5 → "||||"   3 → "|||"
 * The fifth stroke uses a unicode combining strikethrough so it reads
 * as a crossed bundle of four — no images or icon fonts needed.
 */
function makeTally(n) {
  if (n === 0) return '—'
  const groups = Math.floor(n / 5)
  const rem = n % 5
  // ̶ is combining long stroke overlay (strikethrough)
  const bundle = '|̶|̶|̶|̶|̶'
  return (bundle + ' ').repeat(groups) + '|'.repeat(rem)
}

function formatLedgerDate(utcString) {
  if (!utcString) return ''
  try {
    return new Date(utcString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',   // ← was '2-digit' → showed "May 18, 26"
    })
  } catch {
    return utcString
  }
}

function getMonthLabel() {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function SummaryView({ entries }) {
  const safeEntries = Array.isArray(entries) ? entries : []

  const now = new Date()
  const thisMonth = safeEntries.filter((e) => {
    if (!e.timestampUtc) return false
    const d = new Date(e.timestampUtc)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const moodCounts = { Happy: 0, Neutral: 0, Sad: 0 }
  thisMonth.forEach((e) => { if (e.moodType in moodCounts) moodCounts[e.moodType]++ })

  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]

  // Group all entries by day (YYYY-MM-DD) for the ledger, newest first
  const byDay = {}
  ;[...safeEntries]
    .sort((a, b) => new Date(b.timestampUtc) - new Date(a.timestampUtc))
    .forEach((e) => {
      if (!e.timestampUtc) return
      const day = new Date(e.timestampUtc).toISOString().slice(0, 10)
      if (!byDay[day]) byDay[day] = { date: e.timestampUtc, moods: [] }
      byDay[day].moods.push(e.moodType)
    })

  const ledgerRows = Object.values(byDay)

  return (
    <div className="summary-view">
      <h2 className="summary-title">Month in Review</h2>
      <p className="summary-month-label">{getMonthLabel()}</p>
      <div className="section-underline" style={{ marginBottom: 20 }} />

      {/* Top stat */}
      {topMood && topMood[1] > 0 && (
        <div className="summary-stat-bar">
          <span className="summary-stat-label">Most felt this month</span>
          <span
            className="summary-stat-value"
            style={{ color: MOOD_COLORS[topMood[0]] }}
          >
            {topMood[0]}
          </span>
          <span className="summary-stat-count">× {topMood[1]}</span>
        </div>
      )}

      {/* Mood tally cards */}
      <div className="mood-tally-row">
        {['Happy', 'Neutral', 'Sad'].map((mood) => (
          <div
            className="tally-card"
            key={mood}
            style={{
              borderTopColor: MOOD_COLORS[mood],
              borderTopWidth: 4,
            }}
          >
            <MoodCanvasFace mood={mood} size={52} />
            <div
              className="tally-card-label"
              style={{ color: MOOD_COLORS[mood], fontWeight: 700 }}
            >
              {mood}
            </div>
            <div className="tally-marks">{makeTally(moodCounts[mood])}</div>
            <div className="tally-count">{moodCounts[mood]}</div>
          </div>
        ))}
      </div>

      {/* Daily Ledger — one row per day */}
      <h3 className="ledger-title">Daily Ledger</h3>

      {ledgerRows.length === 0 ? (
        <p className="timeline-empty">No entries yet — start journaling!</p>
      ) : (
        <div className="ledger-table">
          <div className="ledger-header">
            <span>Date</span>
            <span>Mood</span>
            <span>Tally</span>
          </div>
          {ledgerRows.map(({ date, moods }) => {
            // Show the most frequent mood for that day
            const freq = {}
            moods.forEach((m) => { freq[m] = (freq[m] || 0) + 1 })
            const dominantMood = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]
            return (
              <div className="ledger-row" key={date}>
                <span>{formatLedgerDate(date)}</span>
                <span style={{ color: MOOD_COLORS[dominantMood] }}>{dominantMood}</span>
                <span className="ledger-tally">{makeTally(moods.length)}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
