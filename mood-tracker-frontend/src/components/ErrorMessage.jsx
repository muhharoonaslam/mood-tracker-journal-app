import React from 'react'

/**
 * Inline error message — red ink style.
 * @param {{ message: string|null }} props
 */
export default function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="error-msg" role="alert">
      {message}
    </div>
  )
}
