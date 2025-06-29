import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { activityService } from '../services/activityService'
import toast from 'react-hot-toast'

const ActivityContext = createContext()

export const useActivity = () => {
  const context = useContext(ActivityContext)
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider')
  }
  return context
}

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const { user } = useAuth()

  const fetchActivities = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const data = await activityService.getUserActivities()
      setActivities(data)
    } catch (error) {
      toast.error('Failed to fetch activities')
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const addActivity = async (activityData) => {
    if (!user) return
    
    try {
      const newActivity = await activityService.trackActivity(activityData)
      setActivities(prev => [newActivity, ...prev])
      toast.success('Activity tracked successfully!')
      return newActivity
    } catch (error) {
      toast.error('Failed to track activity')
      throw error
    }
  }

  const updateActivity = async (activityId, activityData) => {
    if (!user) return
    
    try {
      const updatedActivity = await activityService.updateActivity(activityId, activityData)
      setActivities(prev => 
        prev.map(activity => 
          activity.id === activityId ? updatedActivity : activity
        )
      )
      toast.success('Activity updated successfully!')
      return updatedActivity
    } catch (error) {
      toast.error('Failed to update activity')
      throw error
    }
  }

  const deleteActivity = async (activityId) => {
    if (!user) return
    
    try {
      await activityService.deleteActivity(activityId)
      setActivities(prev => prev.filter(activity => activity.id !== activityId))
      toast.success('Activity deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete activity')
      throw error
    }
  }

  const fetchStats = async () => {
    if (!user) return
    
    try {
      const data = await activityService.getUserStats()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchActivities()
      fetchStats()
    }
  }, [user])

  const value = {
    activities,
    stats,
    loading,
    fetchActivities,
    addActivity,
    updateActivity,
    deleteActivity,
    fetchStats
  }

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  )
} 