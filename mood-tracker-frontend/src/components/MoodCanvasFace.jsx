import React, { useRef, useEffect } from 'react'

/**
 * Draws a wobbly, hand-drawn mood face on an HTML5 canvas.
 * Props: mood ('Happy'|'Neutral'|'Sad'), size (default 80), fill (default '#F0EAD6')
 */

function drawWobblyCircle(ctx, cx, cy, r, color, lineWidth) {
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.lineCap = 'round'

  // Fixed offsets for consistent "hand-drawn" wobble — not truly random
  const offsets = [
    [0.05, -0.08],
    [-0.06, 0.04],
    [0.08, 0.05],
    [-0.04, -0.06],
    [0.06, 0.08],
    [-0.08, -0.03],
    [0.03, 0.07],
    [0.07, -0.05],
  ]

  const points = offsets.map(([ox, oy], i) => {
    const angle = (i / offsets.length) * Math.PI * 2
    return [
      cx + (r + ox * r) * Math.cos(angle),
      cy + (r + oy * r) * Math.sin(angle),
    ]
  })

  ctx.moveTo(points[0][0], points[0][1])
  for (let i = 0; i < points.length; i++) {
    const next = points[(i + 1) % points.length]
    const cpx = (points[i][0] + next[0]) / 2
    const cpy = (points[i][1] + next[1]) / 2
    ctx.quadraticCurveTo(points[i][0], points[i][1], cpx, cpy)
  }
  ctx.closePath()
  ctx.stroke()
}

export default function MoodCanvasFace({ mood = 'Neutral', size = 80, fill = '#F0EAD6' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, size, size)

    const cx = size / 2
    const cy = size / 2
    const r = size * 0.42
    const inkColor = '#1A1A1A'
    const strokeW = size * 0.04

    // Fill face with aged-paper color
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = fill
    ctx.fill()

    // Wobbly outline
    drawWobblyCircle(ctx, cx, cy, r, inkColor, strokeW)

    // Eyes
    const eyeY = cy - r * 0.2
    const eyeOffX = r * 0.32
    const eyeR = Math.max(3, size * 0.045)

    ctx.fillStyle = inkColor
    ;[cx - eyeOffX, cx + eyeOffX].forEach((ex) => {
      ctx.beginPath()
      ctx.arc(ex, eyeY, eyeR, 0, Math.PI * 2)
      ctx.fill()
    })

    // Mouth
    ctx.strokeStyle = inkColor
    ctx.lineWidth = strokeW
    ctx.lineCap = 'round'

    const mouthY = cy + r * 0.28
    const mouthHalfW = r * 0.38

    if (mood === 'Happy') {
      ctx.beginPath()
      ctx.arc(cx, mouthY - r * 0.1, mouthHalfW, 0.15 * Math.PI, 0.85 * Math.PI)
      ctx.stroke()
    } else if (mood === 'Neutral') {
      ctx.beginPath()
      ctx.moveTo(cx - mouthHalfW, mouthY)
      ctx.lineTo(cx + mouthHalfW, mouthY)
      ctx.stroke()
    } else {
      // Sad — downward arc
      ctx.beginPath()
      ctx.arc(cx, mouthY + r * 0.22, mouthHalfW, 1.15 * Math.PI, 1.85 * Math.PI)
      ctx.stroke()
    }
  }, [mood, size, fill])

  return (
    <canvas
      ref={canvasRef}
      aria-label={`${mood} mood face`}
      role="img"
      style={{ display: 'block', flexShrink: 0 }}
    />
  )
}
