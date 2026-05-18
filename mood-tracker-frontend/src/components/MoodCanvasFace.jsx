import React, { useRef, useEffect } from 'react'

const MOOD_COLORS = {
  Happy: '#E8913A',
  Neutral: '#7A8B69',
  Sad: '#6B8CAE',
}

/**
 * Draws a mood face on an HTML5 canvas — no SVG, no emoji, no images.
 * @param {{ mood: 'Happy'|'Neutral'|'Sad', size?: number, animated?: boolean }} props
 */
export default function MoodCanvasFace({ mood = 'Neutral', size = 60, animated = false }) {
  const canvasRef = useRef(null)
  const animFrameRef = useRef(null)
  const startTimeRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    // Set up HiDPI canvas
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    function draw(t) {
      ctx.clearRect(0, 0, size, size)
      const cx = size / 2
      const cy = size / 2
      const r = size * 0.42
      const moodColor = MOOD_COLORS[mood] || MOOD_COLORS.Neutral

      // Animated float offset
      const floatY = animated ? Math.sin(t * 0.002) * 1.5 : 0

      // ── Face circle ──
      ctx.beginPath()
      ctx.arc(cx, cy + floatY, r, 0, Math.PI * 2)
      ctx.fillStyle = '#FFF8F0'
      ctx.fill()
      ctx.strokeStyle = moodColor
      ctx.lineWidth = size * 0.038
      ctx.stroke()

      // ── Eyes ──
      const eyeY = cy + floatY - r * 0.18
      const eyeOffX = r * 0.32
      const eyeR = r * 0.09

      if (mood === 'Sad') {
        // Slightly angled eyebrows above eyes (inner corners raised for sad look)
        ctx.beginPath()
        ctx.strokeStyle = moodColor
        ctx.lineWidth = size * 0.04
        ctx.lineCap = 'round'
        // Left brow – inner end lower
        ctx.moveTo(cx - eyeOffX - r * 0.12, eyeY - r * 0.28)
        ctx.lineTo(cx - eyeOffX + r * 0.12, eyeY - r * 0.18)
        ctx.stroke()
        // Right brow – inner end lower
        ctx.beginPath()
        ctx.moveTo(cx + eyeOffX + r * 0.12, eyeY - r * 0.28)
        ctx.lineTo(cx + eyeOffX - r * 0.12, eyeY - r * 0.18)
        ctx.stroke()
      }

      // Eye dots
      ;[cx - eyeOffX, cx + eyeOffX].forEach((ex) => {
        ctx.beginPath()
        ctx.arc(ex, eyeY, eyeR, 0, Math.PI * 2)
        ctx.fillStyle = moodColor
        ctx.fill()
      })

      // ── Mouth ──
      const mouthY = cy + floatY + r * 0.25
      const mouthHalfW = r * 0.38
      ctx.beginPath()
      ctx.strokeStyle = moodColor
      ctx.lineWidth = size * 0.045
      ctx.lineCap = 'round'

      if (mood === 'Happy') {
        // Upward arc
        ctx.arc(cx, mouthY - r * 0.08, mouthHalfW, 0.15 * Math.PI, 0.85 * Math.PI)
        ctx.stroke()

        // Blush circles
        const blushR = r * 0.14
        const blushY = cy + floatY + r * 0.12
        ;[cx - r * 0.52, cx + r * 0.52].forEach((bx) => {
          ctx.beginPath()
          ctx.arc(bx, blushY, blushR, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(232, 145, 58, 0.22)'
          ctx.fill()
        })
      } else if (mood === 'Neutral') {
        // Straight line
        ctx.moveTo(cx - mouthHalfW, mouthY)
        ctx.lineTo(cx + mouthHalfW, mouthY)
        ctx.stroke()
      } else {
        // Sad – downward arc
        ctx.arc(cx, mouthY + r * 0.22, mouthHalfW, 1.15 * Math.PI, 1.85 * Math.PI)
        ctx.stroke()
      }
    }

    if (animated) {
      function loop(timestamp) {
        if (!startTimeRef.current) startTimeRef.current = timestamp
        draw(timestamp - startTimeRef.current)
        animFrameRef.current = requestAnimationFrame(loop)
      }
      animFrameRef.current = requestAnimationFrame(loop)
    } else {
      draw(0)
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      startTimeRef.current = null
    }
  }, [mood, size, animated])

  return (
    <canvas
      ref={canvasRef}
      aria-label={`${mood} mood face`}
      role="img"
      style={{ display: 'block', flexShrink: 0 }}
    />
  )
}
