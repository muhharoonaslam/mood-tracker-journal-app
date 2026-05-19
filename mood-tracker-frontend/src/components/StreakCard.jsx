import React from 'react'

function localDateStr(d) {
  const date = new Date(d)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function calculateStreak(entries) {
  if (!entries || entries.length === 0) return 0

  const dates = Array.from(
    new Set(
      entries
        .filter((e) => e.timestampUtc)
        .map((e) => localDateStr(e.timestampUtc))
    )
  ).sort((a, b) => (a > b ? -1 : 1))

  if (dates.length === 0) return 0

  const todayStr = localDateStr(new Date())
  const yesterdayStr = localDateStr(new Date(Date.now() - 86400000))

  if (dates[0] !== todayStr && dates[0] !== yesterdayStr) return 0

  let streak = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    const diff = (prev.getTime() - curr.getTime()) / 86400000
    if (Math.round(diff) === 1) {
      streak++
    } else {
      break
    }
  }

  return streak
}

const QUOTES = [
  '"Consistency is the hand that guides the pen."',
  '"A page a day keeps the fog away."',
  '"Every entry is a breadcrumb back to yourself."',
  '"The habit of reflection is the habit of growth."',
]

export default function StreakCard({ entries }) {
  const streak = calculateStreak(entries)
  const quote = QUOTES[streak % QUOTES.length]

  return (
    <div className="streak-card">
      <div className="streak-title">Streak</div>
      <div>
        <span className="streak-number">{streak}</span>
        <span className="streak-unit"> DAYS</span>
      </div>
      <p className="streak-quote">{quote}</p>
    </div>
  )
}
