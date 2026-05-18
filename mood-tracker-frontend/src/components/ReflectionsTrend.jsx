import React, { useRef, useEffect } from 'react'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
// Monday = 0 ... Sunday = 6 (mapped from JS getDay() where 0=Sun)
function jsDayToIndex(jsDay) {
  // JS: 0=Sun, 1=Mon ... 6=Sat
  // We want: 0=Mon ... 6=Sun
  return jsDay === 0 ? 6 : jsDay - 1
}

/**
 * Canvas bar chart showing entry count per day of the week.
 * Current weekday bar is terracotta; others are ink-black.
 * @param {{ entries: object[] }} props
 */
export default function ReflectionsTrend({ entries }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    const W = canvas.offsetWidth || 300
    const H = 140

    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = `${W}px`
    canvas.style.height = `${H}px`
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, W, H)

    // Count entries per weekday (Mon=0 ... Sun=6)
    const counts = [0, 0, 0, 0, 0, 0, 0]
    if (entries && entries.length > 0) {
      entries.forEach((e) => {
        if (!e.timestampUtc) return
        const d = new Date(e.timestampUtc)
        const idx = jsDayToIndex(d.getDay())
        counts[idx]++
      })
    }

    const maxCount = Math.max(...counts, 1)
    const todayIdx = jsDayToIndex(new Date().getDay())

    const padLeft = 12
    const padRight = 12
    const padTop = 12
    const labelH = 24
    const chartH = H - padTop - labelH
    const barAreaW = W - padLeft - padRight
    const barW = Math.floor(barAreaW / 7) - 4
    const barGap = Math.floor(barAreaW / 7)

    const inkColor = '#1A1A1A'
    const terracotta = '#E9A390'
    const graphite = 'rgba(122,117,103,0.5)'

    // Draw subtle horizontal grid lines
    ctx.strokeStyle = graphite
    ctx.lineWidth = 0.5
    const gridLines = 4
    for (let g = 0; g <= gridLines; g++) {
      const y = padTop + (chartH * g) / gridLines
      ctx.beginPath()
      ctx.moveTo(padLeft, y)
      ctx.lineTo(W - padRight, y)
      ctx.stroke()
    }

    // Draw bars
    for (let i = 0; i < 7; i++) {
      const barH = counts[i] === 0
        ? 4
        : Math.max(6, (counts[i] / maxCount) * (chartH - 8))
      const x = padLeft + i * barGap + (barGap - barW) / 2
      const y = padTop + chartH - barH

      ctx.fillStyle = i === todayIdx ? terracotta : inkColor

      // Slightly wobbly bar top (hand-drawn feel)
      ctx.beginPath()
      ctx.moveTo(x, y + 3)
      ctx.lineTo(x + barW * 0.3, y)
      ctx.lineTo(x + barW * 0.7, y + 2)
      ctx.lineTo(x + barW, y + 1)
      ctx.lineTo(x + barW, padTop + chartH)
      ctx.lineTo(x, padTop + chartH)
      ctx.closePath()
      ctx.fill()

      // Outline
      ctx.strokeStyle = inkColor
      ctx.lineWidth = 1.5
      ctx.strokeRect(x, y, barW, barH)

      // Hard shadow (only for non-zero)
      if (counts[i] > 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.25)'
        ctx.fillRect(x + 3, y + 3, barW, barH)
        // Redraw bar on top
        ctx.fillStyle = i === todayIdx ? terracotta : inkColor
        ctx.fillRect(x, y, barW, barH)
        ctx.strokeStyle = inkColor
        ctx.lineWidth = 1.5
        ctx.strokeRect(x, y, barW, barH)
      }

      // Day label
      ctx.fillStyle = i === todayIdx ? terracotta : inkColor
      ctx.font = `bold 11px 'Architects Daughter', cursive`
      ctx.textAlign = 'center'
      ctx.fillText(DAY_LABELS[i], x + barW / 2, padTop + chartH + labelH - 6)
    }
  }, [entries])

  return (
    <div className="trend-card">
      <div className="trend-title">Reflections This Week</div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', display: 'block' }}
        aria-label="Bar chart showing mood entries per day of the week"
        role="img"
      />
    </div>
  )
}
