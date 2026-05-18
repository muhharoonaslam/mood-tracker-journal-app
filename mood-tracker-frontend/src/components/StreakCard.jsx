import React from 'react'

/**
 * Calculates the current streak (consecutive days ending today or yesterday).
 * @param {object[]} entries - array of mood entries with timestampUtc
 * @returns {number}
 */
function calculateStreak(entries) {
  if (!entries || entries.length === 0) return 0

  // Get unique dates (YYYY-MM-DD) in descending order
  const dates = Array.from(
    new Set(
      entries
        .filter((e) => e.timestampUtc)
        .map((e) => {
          const d = new Date(e.timestampUtc)
          return d.toISOString().slice(0, 10)
        })
    )
  ).sort((a, b) => (a > b ? -1 : 1))

  if (dates.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayStr = today.toISOString().slice(0, 10)
  const yesterdayStr = new Date(today.getTime() - 86400000).toISOString().slice(0, 10)

  // Streak must start from today or yesterday
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

/**
 * Terracotta streak card showing consecutive journaling days.
 * @param {{ entries: object[] }} props
 */
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
