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

export const recommendationService = {
  // Get recommendations for a user
  async getUserRecommendations(category = null, limit = 10) {
    const userId = JSON.parse(localStorage.getItem('user'))?.id || 'user-123'
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    params.append('limit', limit)
    
    return api.get(`/recommendations/user/${userId}?${params.toString()}`)
  },

  // Get recommendation for a specific activity
  async getActivityRecommendation(activityId) {
    return api.get(`/recommendations/activity/${activityId}`)
  },

  // Generate new recommendations
  async generateRecommendations(focusArea = null) {
    const userId = JSON.parse(localStorage.getItem('user'))?.id || 'user-123'
    const params = new URLSearchParams()
    if (focusArea) params.append('focusArea', focusArea)
    
    return api.post(`/recommendations/generate/${userId}?${params.toString()}`)
  },

  // Update recommendation feedback
  async updateFeedback(recommendationId, feedback) {
    return api.put(`/recommendations/${recommendationId}/feedback`, feedback)
  },

  // Get user insights
  async getUserInsights(timeRange = null) {
    const userId = JSON.parse(localStorage.getItem('user'))?.id || 'user-123'
    const params = new URLSearchParams()
    if (timeRange) params.append('timeRange', timeRange)
    
    return api.get(`/recommendations/insights/${userId}?${params.toString()}`)
  },

  // Get user trends
  async getUserTrends(days = 30) {
    const userId = JSON.parse(localStorage.getItem('user'))?.id || 'user-123'
    return api.get(`/recommendations/trends/${userId}?days=${days}`)
  },

  // Delete a recommendation
  async deleteRecommendation(recommendationId) {
    const userId = JSON.parse(localStorage.getItem('user'))?.id || 'user-123'
    return api.delete(`/recommendations/${recommendationId}?userId=${userId}`)
  },

  // Health check
  async healthCheck() {
    return api.get('/recommendations/health')
  }
} 