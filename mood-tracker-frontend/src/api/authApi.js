import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || ''

/**
 * Register a new user account.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} response data
 */
export async function register(email, password) {
  const response = await axios.post(`${BASE_URL}/api/auth/register`, {
    email,
    password,
  })
  return response.data
}

/**
 * Log in with existing credentials.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string }>} response data containing JWT token
 */
export async function login(email, password) {
  const response = await axios.post(`${BASE_URL}/api/auth/login`, {
    email,
    password,
  })
  return response.data
}
