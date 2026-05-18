import React from 'react'

/**
 * Handwritten-style loading indicator.
 * @param {{ text?: string }} props
 */
export default function LoadingState({ text = 'Loading' }) {
  return (
    <p className="loading-txt" aria-live="polite">
      {text}...
    </p>
  )
}
