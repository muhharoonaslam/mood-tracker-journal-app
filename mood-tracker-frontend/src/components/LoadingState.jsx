import React from 'react'

/**
 * Animated loading indicator matching the Paper & Ink theme.
 * @param {{ text?: string }} props
 */
export default function LoadingState({ text = 'Loading' }) {
  return (
    <div className="loading-state" aria-live="polite" aria-label={text}>
      <span>{text}</span>
      <span className="loading-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </div>
  )
}
