import React, { useRef, useEffect } from 'react'

/**
 * Draws tally marks on canvas — 4 vertical strokes + 1 diagonal cross per group of 5.
 * No fonts, no unicode tricks, no images.
 */
export default function TallyMarks({ count, color = '#1A1A1A', height = 28 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    const groups = Math.floor(count / 5)
    const rem = count % 5
    const totalGroups = groups + (rem > 0 ? 1 : 0)

    const strokeW = 2.5
    const strokeH = height * 0.72
    const strokeGap = 6      // gap between strokes in a group
    const groupGap = 12      // gap between groups
    const groupW = strokeGap * 4 + strokeW  // width of 4 vertical strokes

    const W = Math.max(
      30,
      totalGroups * (groupW + groupGap) - groupGap + strokeW * 2
    )
    const H = height

    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = `${W}px`
    canvas.style.height = `${H}px`
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, W, H)

    ctx.strokeStyle = color
    ctx.lineWidth = strokeW
    ctx.lineCap = 'round'

    const top = (H - strokeH) / 2
    const bot = top + strokeH

    let xCursor = strokeW

    for (let g = 0; g < groups; g++) {
      // 4 vertical strokes
      for (let s = 0; s < 4; s++) {
        const x = xCursor + s * strokeGap
        ctx.beginPath()
        ctx.moveTo(x, top)
        ctx.lineTo(x, bot)
        ctx.stroke()
      }
      // Diagonal cross stroke (bottom-left to top-right across the group)
      ctx.beginPath()
      ctx.moveTo(xCursor - strokeGap * 0.4, bot + 2)
      ctx.lineTo(xCursor + strokeGap * 3 + strokeW + strokeGap * 0.4, top - 2)
      ctx.stroke()
      xCursor += groupW + groupGap
    }

    // Remaining strokes
    for (let s = 0; s < rem; s++) {
      const x = xCursor + s * strokeGap
      ctx.beginPath()
      ctx.moveTo(x, top)
      ctx.lineTo(x, bot)
      ctx.stroke()
    }
  }, [count, color, height])

  if (count === 0) {
    return (
      <span style={{
        fontFamily: "'Architects Daughter', cursive",
        fontSize: 16,
        color: '#7A7567',
      }}>—</span>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      aria-label={`${count} tally mark${count !== 1 ? 's' : ''}`}
      role="img"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    />
  )
}
