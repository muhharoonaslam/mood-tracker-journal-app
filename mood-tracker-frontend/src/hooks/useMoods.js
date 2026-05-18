import { useState, useCallback } from 'react'
import * as moodsApi from '../api/moodsApi'

export function useMoods() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchEntries = useCallback(async (token) => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const data = await moodsApi.getRecent(token)
      setEntries(Array.isArray(data) ? data : [])
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to load entries.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const submitMood = useCallback(async (token, moodType, note) => {
    setSubmitting(true)
    setError(null)
    try {
      const created = await moodsApi.createMood(token, moodType, note)
      return created
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to save mood.'
      setError(message)
      throw err
    } finally {
      setSubmitting(false)
    }
  }, [])

  return { entries, loading, error, submitting, fetchEntries, submitMood }
}
