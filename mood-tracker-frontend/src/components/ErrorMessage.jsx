import React from 'react'

/**
 * Displays an inline error message in the Paper & Ink style.
 * @param {{ message: string }} props
 */
export default function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="error-message" role="alert">
      {message}
    </div>
  )
}
