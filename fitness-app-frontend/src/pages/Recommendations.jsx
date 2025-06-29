import { useState, useEffect } from 'react'
import { 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Clock, 
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  BarChart3
} from 'lucide-react'
import { recommendationService } from '../services/recommendationService'
import toast from 'react-hot-toast'

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([])
  const [insights, setInsights] = useState(null)
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchRecommendations()
    fetchInsights()
    fetchTrends()
  }, [])

  const fetchRecommendations = async () => {
    try {
      const data = await recommendationService.getUserRecommendations()
      setRecommendations(data)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      // Mock data for demo
      setRecommendations([
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
        },
        {
          id: '3',
          title: 'Improve Recovery',
          description: 'Consider adding yoga or stretching sessions to improve flexibility and recovery.',
          category: 'RECOVERY',
          priority: 'LOW',
          createdAt: new Date().toISOString()
        }
      ])
    }
  }

  const fetchInsights = async () => {
    try {
      const data = await recommendationService.getUserInsights()
      setInsights(data)
    } catch (error) {
      console.error('Error fetching insights:', error)
      // Mock data for demo
      setInsights({
        weeklyProgress: 75,
        improvementAreas: ['Cardio endurance', 'Strength training'],
        achievements: ['Consistent workout schedule', 'Improved running pace'],
        nextGoals: ['Complete 5K run', 'Add strength training']
      })
    }
  }

  const fetchTrends = async () => {
    try {
      const data = await recommendationService.getUserTrends()
      setTrends(data)
    } catch (error) {
      console.error('Error fetching trends:', error)
      // Mock data for demo
      setTrends({
        weeklyActivity: [3, 4, 2, 5, 3, 4, 6],
        caloriesBurned: [1200, 1400, 800, 1600, 1200, 1400, 1800],
        averageDuration: [45, 50, 30, 60, 45, 50, 65]
      })
    } finally {
      setLoading(false)
    }
  }

  const generateNewRecommendations = async () => {
    setGenerating(true)
    try {
      const newRecs = await recommendationService.generateRecommendations()
      setRecommendations(newRecs)
      toast.success('New recommendations generated!')
    } catch (error) {
      console.error('Error generating recommendations:', error)
      toast.error('Failed to generate recommendations')
    } finally {
      setGenerating(false)
    }
  }

  const handleFeedback = async (recommendationId, feedback) => {
    try {
      await recommendationService.updateFeedback(recommendationId, { rating: feedback })
      toast.success('Feedback submitted!')
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error('Failed to submit feedback')
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'CARDIO': return '🏃‍♂️'
      case 'STRENGTH': return '💪'
      case 'RECOVERY': return '🧘‍♀️'
      case 'NUTRITION': return '🥗'
      default: return '🎯'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Recommendations</h1>
          <p className="text-gray-600 mt-1">
            Personalized fitness insights and suggestions
          </p>
        </div>
        <button
          onClick={generateNewRecommendations}
          disabled={generating}
          className="btn-primary mt-4 sm:mt-0 inline-flex items-center"
        >
          {generating ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Generate New
        </button>
      </div>

      {/* Insights Overview */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-blue-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Weekly Progress</p>
                <p className="text-2xl font-semibold text-gray-900">{insights.weeklyProgress}%</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-green-500">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Achievements</p>
                <p className="text-2xl font-semibold text-gray-900">{insights.achievements?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-orange-500">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Next Goals</p>
                <p className="text-2xl font-semibold text-gray-900">{insights.nextGoals?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-purple-500">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Areas to Improve</p>
                <p className="text-2xl font-semibold text-gray-900">{insights.improvementAreas?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Current Recommendations</h2>
        
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((recommendation) => (
              <div key={recommendation.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">
                      {getCategoryIcon(recommendation.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {recommendation.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(recommendation.priority)}`}>
                          {recommendation.priority}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {recommendation.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleFeedback(recommendation.id, 'positive')}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleFeedback(recommendation.id, 'negative')}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Lightbulb className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No recommendations yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Generate personalized recommendations based on your activity data
            </p>
            <div className="mt-6">
              <button
                onClick={generateNewRecommendations}
                disabled={generating}
                className="btn-primary"
              >
                Generate Recommendations
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Trends Chart Placeholder */}
      {trends && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Trends</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">Chart visualization would go here</p>
              <p className="text-xs text-gray-400">Using Recharts library for data visualization</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Recommendations 