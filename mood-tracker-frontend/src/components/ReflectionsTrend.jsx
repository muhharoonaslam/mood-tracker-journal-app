import React, { useRef, useEffect } from 'react'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function jsDayToIndex(jsDay) {
  return jsDay === 0 ? 6 : jsDay - 1
}

function draw(canvas, entries) {
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const W = canvas.clientWidth
  const H = 160

  if (W <= 0) return

  canvas.width = W * dpr
  canvas.height = H * dpr
  canvas.style.height = `${H}px`
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, W, H)

  // Count entries per weekday
  const counts = [0, 0, 0, 0, 0, 0, 0]
  if (entries && entries.length > 0) {
    entries.forEach((e) => {
      if (!e.timestampUtc) return
      counts[jsDayToIndex(new Date(e.timestampUtc).getDay())]++
    })
  }

  const maxCount = Math.max(...counts, 1)
  const todayIdx = jsDayToIndex(new Date().getDay())

  const PAD_L = 8
  const PAD_R = 8
  const PAD_TOP = 8
  const LABEL_H = 20
  const chartH = H - PAD_TOP - LABEL_H
  const slotW = (W - PAD_L - PAD_R) / 7
  const barW = Math.max(8, slotW * 0.55)

  const INK = '#1A1A1A'
  const TERRA = '#E9A390'
  const GRID = 'rgba(122,117,103,0.3)'

  // Grid lines
  ctx.strokeStyle = GRID
  ctx.lineWidth = 1
  for (let g = 1; g <= 4; g++) {
    const y = PAD_TOP + chartH - (chartH * g) / 4
    ctx.beginPath()
    ctx.moveTo(PAD_L, y)
    ctx.lineTo(W - PAD_R, y)
    ctx.stroke()
  }

  // Bars
  for (let i = 0; i < 7; i++) {
    const isToday = i === todayIdx
    const color = isToday ? TERRA : INK
    const barH = counts[i] === 0
      ? 3
      : Math.max(8, (counts[i] / maxCount) * (chartH - 4))

    const slotX = PAD_L + i * slotW
    const x = slotX + (slotW - barW) / 2
    const y = PAD_TOP + chartH - barH

    // Shadow (drawn first, behind the bar)
    if (counts[i] > 0) {
      ctx.fillStyle = 'rgba(0,0,0,0.22)'
      ctx.fillRect(x + 3, y + 3, barW, barH)
    }

    // Bar fill
    ctx.fillStyle = color
    ctx.fillRect(x, y, barW, barH)

    // Bar border
    ctx.strokeStyle = INK
    ctx.lineWidth = 1.5
    ctx.strokeRect(x, y, barW, barH)

    // Day label
    ctx.fillStyle = isToday ? TERRA : INK
    ctx.font = `12px 'Architects Daughter', cursive`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(DAY_LABELS[i], x + barW / 2, PAD_TOP + chartH + 4)
  }
}

export default function ReflectionsTrend({ entries }) {
  const canvasRef = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    // Draw once immediately (may be 0-width; observer will re-draw)
    draw(canvas, entries)

    // Re-draw whenever the container resizes
    const ro = new ResizeObserver(() => draw(canvas, entries))
    ro.observe(wrapper)
    return () => ro.disconnect()
  }, [entries])

  return (
    <div className="trend-card">
      <div className="trend-title">Reflections This Week</div>
      <div ref={wrapperRef} style={{ width: '100%' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', display: 'block' }}
          aria-label="Bar chart showing mood entries per day of the week"
          role="img"
        />
      </div>
    </div>
  )
}
