import React from 'react'
import MoodCanvasFace from './MoodCanvasFace'

const MOOD_COLORS = { Happy: '#E8913A', Neutral: '#7A8B69', Sad: '#6B8CAE' }

function formatLedgerDate(utcString) {
  if (!utcString) return ''
  try {
    return new Date(utcString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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

      {topMood && topMood[1] > 0 && (
        <div className="summary-stat-bar">
          <span className="summary-stat-label">Most felt this month</span>
          <span className="summary-stat-value" style={{ color: MOOD_COLORS[topMood[0]] }}>
            {topMood[0]}
          </span>
          <span className="summary-stat-count">× {topMood[1]}</span>
        </div>
      )}

      <div className="mood-tally-row">
        {['Happy', 'Neutral', 'Sad'].map((mood) => (
          <div
            className="tally-card"
            key={mood}
            style={{ borderTopColor: MOOD_COLORS[mood], borderTopWidth: 4 }}
          >
            <MoodCanvasFace mood={mood} size={52} />
            <div className="tally-card-label" style={{ color: MOOD_COLORS[mood], fontWeight: 700 }}>
              {mood}
            </div>
            <div
              className="tally-count"
              style={{ fontSize: '2rem', fontWeight: 700, color: MOOD_COLORS[mood], lineHeight: 1.2 }}
            >
              {moodCounts[mood]}
            </div>
          </div>
        ))}
      </div>

      <h3 className="ledger-title">Daily Ledger</h3>

      {ledgerRows.length === 0 ? (
        <p className="timeline-empty">No entries yet — start journaling!</p>
      ) : (
        <div className="ledger-table">
          <div className="ledger-header">
            <span>Date</span>
            <span>Mood</span>
            <span>Count</span>
          </div>
          {ledgerRows.map(({ date, moods }) => {
            const freq = {}
            moods.forEach((m) => { freq[m] = (freq[m] || 0) + 1 })
            const orderedMoods = ['Happy', 'Neutral', 'Sad'].filter((m) => freq[m])
            return (
              <div className="ledger-row" key={date}>
                <span>{formatLedgerDate(date)}</span>
                <span className="ledger-moods">
                  {orderedMoods.map((m) => (
                    <span
                      key={m}
                      className="ledger-mood-chip"
                      style={{ color: MOOD_COLORS[m], borderColor: MOOD_COLORS[m] }}
                    >
                      {m} ×{freq[m]}
                    </span>
                  ))}
                </span>
                <span className="ledger-tally-count" style={{ fontWeight: 700 }}>
                  {moods.length}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
