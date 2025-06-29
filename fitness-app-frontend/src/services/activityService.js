import axios from 'axios'

const API_BASE_URL = '/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    config.headers['X-User-ID'] = JSON.parse(localStorage.getItem('user'))?.id || 'user-123'
  }
  return config
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    throw error
  }
)

export const activityService = {
  // Get all activities for the current user
  async getUserActivities(filters = {}) {
    const params = new URLSearchParams()
    if (filters.activityType) params.append('activityType', filters.activityType)
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)
    if (filters.page) params.append('page', filters.page)
    if (filters.size) params.append('size', filters.size)
    
    return api.get(`/activities?${params.toString()}`)
  },

  // Get a specific activity by ID
  async getActivityById(activityId) {
    return api.get(`/activities/${activityId}`)
  },

  // Track a new activity
  async trackActivity(activityData) {
    return api.post('/activities', activityData)
  },

  // Update an existing activity
  async updateActivity(activityId, activityData) {
    return api.put(`/activities/${activityId}`, activityData)
  },

  // Delete an activity
  async deleteActivity(activityId) {
    return api.delete(`/activities/${activityId}`)
  },

  // Get user statistics
  async getUserStats(period = '30') {
    const userId = JSON.parse(localStorage.getItem('user'))?.id || 'user-123'
    return api.get(`/activities/stats/${userId}?period=${period}`)
  },

  // Health check
  async healthCheck() {
    return api.get('/activities/health')
  }
} 