import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || ''

/**
 * Fetch recent mood entries for the authenticated user.
 * @param {string} token  JWT bearer token
 * @returns {Promise<object[]>} array of mood entries
 */
export async function getRecent(token) {
  const response = await axios.get(`${BASE_URL}/api/moods/recent`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

/**
 * Create a new mood entry.
 * @param {string} token     JWT bearer token
 * @param {string} moodType  'Happy' | 'Neutral' | 'Sad'
 * @param {string} note      optional journal note
 * @returns {Promise<object>} created mood entry
 */
export async function createMood(token, moodType, note) {
  const response = await axios.post(
    `${BASE_URL}/api/moods`,
    { moodType, note },
    { headers: { Authorization: `Bearer ${token}` } },
  )
  return response.data
}
