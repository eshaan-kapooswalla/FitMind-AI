import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

// AI Service endpoints
const AI_BASE_URL = 'http://localhost:8083/api/ai'

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
  // Get user recommendations
  async getUserRecommendations(userId) {
    try {
      const response = await axios.get(`${AI_BASE_URL}/recommendations/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      throw error
    }
  },

  // Generate new recommendation for activity
  async generateRecommendation(activity) {
    try {
      const response = await axios.post(`${AI_BASE_URL}/recommendations`, activity)
      return response.data
    } catch (error) {
      console.error('Error generating recommendation:', error)
      throw error
    }
  },

  // Generate personalized workout plan
  async generateWorkoutPlan(userProfile, goals, fitnessLevel) {
    try {
      const response = await axios.post(`${AI_BASE_URL}/workout-plan`, {
        userProfile,
        goals,
        fitnessLevel
      })
      return response.data
    } catch (error) {
      console.error('Error generating workout plan:', error)
      throw error
    }
  },

  // Generate nutrition advice
  async generateNutritionAdvice(activityType, caloriesBurned, dietaryRestrictions) {
    try {
      const response = await axios.post(`${AI_BASE_URL}/nutrition-advice`, {
        activityType,
        caloriesBurned,
        dietaryRestrictions
      })
      return response.data
    } catch (error) {
      console.error('Error generating nutrition advice:', error)
      throw error
    }
  },

  // Analyze progress
  async analyzeProgress(activities) {
    try {
      const response = await axios.post(`${AI_BASE_URL}/progress-analysis`, {
        activities
      })
      return response.data
    } catch (error) {
      console.error('Error analyzing progress:', error)
      throw error
    }
  },

  // Generate motivational message
  async generateMotivationalMessage(userMood, recentActivity, goals) {
    try {
      const response = await axios.post(`${AI_BASE_URL}/motivation`, {
        userMood,
        recentActivity,
        goals
      })
      return response.data
    } catch (error) {
      console.error('Error generating motivational message:', error)
      throw error
    }
  },

  // Generate injury prevention advice
  async generateInjuryPreventionAdvice(activityType, userAge, fitnessLevel) {
    try {
      const response = await axios.post(`${AI_BASE_URL}/injury-prevention`, {
        activityType,
        userAge,
        fitnessLevel
      })
      return response.data
    } catch (error) {
      console.error('Error generating injury prevention advice:', error)
      throw error
    }
  },

  // Generate social features
  async generateSocialFeatures(activityType, location, goals) {
    try {
      const response = await axios.post(`${AI_BASE_URL}/social-features`, {
        activityType,
        location,
        goals
      })
      return response.data
    } catch (error) {
      console.error('Error generating social features:', error)
      throw error
    }
  },

  // Get personalized coaching
  async getPersonalizedCoaching(userId, recentActivities, currentGoals, fitnessLevel) {
    try {
      const response = await axios.post(`${AI_BASE_URL}/personalized-coaching`, {
        userId,
        recentActivities,
        currentGoals,
        fitnessLevel
      })
      return response.data
    } catch (error) {
      console.error('Error getting personalized coaching:', error)
      throw error
    }
  },

  // Legacy methods for backward compatibility
  async getUserInsights(userId) {
    try {
      // Mock data for now - can be replaced with actual API call
      return {
        weeklyProgress: 75,
        improvementAreas: ['Cardio endurance', 'Strength training'],
        achievements: ['Consistent workout schedule', 'Improved running pace'],
        nextGoals: ['Complete 5K run', 'Add strength training']
      }
    } catch (error) {
      console.error('Error fetching insights:', error)
      throw error
    }
  },

  async getUserTrends(userId) {
    try {
      // Mock data for now - can be replaced with actual API call
      return {
        weeklyActivity: [3, 4, 2, 5, 3, 4, 6],
        caloriesBurned: [1200, 1400, 800, 1600, 1200, 1400, 1800],
        averageDuration: [45, 50, 30, 60, 45, 50, 65]
      }
    } catch (error) {
      console.error('Error fetching trends:', error)
      throw error
    }
  },

  async generateRecommendations() {
    try {
      // Mock data for now - can be replaced with actual API call
      return [
        {
          id: '1',
          title: 'Increase Running Frequency',
          description: 'Based on your recent activities, try adding 2-3 running sessions per week to improve cardiovascular fitness.',
          category: 'CARDIO',
          priority: 'HIGH',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Add Strength Training',
          description: 'Incorporate strength training 2-3 times per week to build muscle and improve overall fitness.',
          category: 'STRENGTH',
          priority: 'MEDIUM',
          createdAt: new Date().toISOString()
        }
      ]
    } catch (error) {
      console.error('Error generating recommendations:', error)
      throw error
    }
  },

  async updateFeedback(recommendationId, feedback) {
    try {
      // Mock implementation - can be replaced with actual API call
      console.log('Updating feedback for recommendation:', recommendationId, feedback)
      return { success: true }
    } catch (error) {
      console.error('Error updating feedback:', error)
      throw error
    }
  },

  // Get recommendation for a specific activity
  async getActivityRecommendation(activityId) {
    return api.get(`/recommendations/activity/${activityId}`)
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