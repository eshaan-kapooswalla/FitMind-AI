import { useState, useEffect } from 'react'
import { 
  Activity, 
  Clock, 
  Flame, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'
import { useActivity } from '../contexts/ActivityContext'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const Activities = () => {
  const { activities, loading, deleteActivity } = useActivity()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const activityTypes = ['RUNNING', 'WALKING', 'CYCLING', 'SWIMMING', 'STRENGTH_TRAINING', 'YOGA']

  const filteredActivities = activities
    .filter(activity => {
      const matchesSearch = activity.type?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterType === 'all' || activity.type === filterType
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.startTime) - new Date(a.startTime)
        case 'duration':
          return b.duration - a.duration
        case 'calories':
          return b.caloriesBurned - a.caloriesBurned
        default:
          return 0
      }
    })

  const handleDelete = async (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await deleteActivity(activityId)
      } catch (error) {
        toast.error('Failed to delete activity')
      }
    }
  }

  const ActivityCard = ({ activity }) => (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <Activity className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {activity.type?.toLowerCase().replace('_', ' ')}
            </h3>
            <p className="text-sm text-gray-500">
              {format(new Date(activity.startTime), 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              {activity.duration} min
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center text-sm text-gray-600">
              <Flame className="h-4 w-4 mr-1" />
              {Math.round(activity.caloriesBurned)} cal
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.location.href = `/activities/edit/${activity.id}`}
              className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(activity.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

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
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your fitness activities
          </p>
        </div>
        <a
          href="/activities/add"
          className="btn-primary mt-4 sm:mt-0 inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </a>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Filter by Type */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              {activityTypes.map(type => (
                <option key={type} value={type}>
                  {type.toLowerCase().replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="date">Sort by Date</option>
              <option value="duration">Sort by Duration</option>
              <option value="calories">Sort by Calories</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        ) : (
          <div className="card text-center py-12">
            <Activity className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first activity'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <div className="mt-6">
                <a href="/activities/add" className="btn-primary">
                  Add Activity
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      {filteredActivities.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">
                {filteredActivities.length}
              </p>
              <p className="text-sm text-gray-500">Activities</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">
                {Math.round(filteredActivities.reduce((sum, a) => sum + a.duration, 0))}
              </p>
              <p className="text-sm text-gray-500">Total Minutes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">
                {Math.round(filteredActivities.reduce((sum, a) => sum + a.caloriesBurned, 0))}
              </p>
              <p className="text-sm text-gray-500">Total Calories</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Activities 