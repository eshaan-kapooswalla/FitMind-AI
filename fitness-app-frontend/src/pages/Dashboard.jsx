import { useEffect } from 'react'
import { 
  Activity, 
  TrendingUp, 
  Flame, 
  Clock, 
  Target,
  Calendar,
  BarChart3,
  Plus,
  Lightbulb,
  User
} from 'lucide-react'
import { useActivity } from '../contexts/ActivityContext'
import { useAuth } from '../contexts/AuthContext'
import { format } from 'date-fns'

const Dashboard = () => {
  const { user } = useAuth()
  const { activities, stats, loading, fetchActivities, fetchStats } = useActivity()

  useEffect(() => {
    fetchActivities()
    fetchStats()
  }, [fetchActivities, fetchStats])

  const recentActivities = activities.slice(0, 5)

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  )

  const ActivityCard = ({ activity }) => (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Activity className="h-5 w-5 text-primary-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 capitalize">
          {activity.type?.toLowerCase() || 'Activity'}
        </p>
        <p className="text-sm text-gray-500">
          {format(new Date(activity.startTime), 'MMM dd, yyyy')}
        </p>
      </div>
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {activity.duration} min
        </div>
        <div className="flex items-center">
          <Flame className="h-4 w-4 mr-1" />
          {activity.caloriesBurned} cal
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-fitness-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'User'}! 👋</h1>
        <p className="text-primary-100 mt-1">
          Ready to crush your fitness goals today?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Activities"
          value={stats?.totalActivities || 0}
          icon={Activity}
          color="bg-blue-500"
          subtitle="This month"
        />
        <StatCard
          title="Calories Burned"
          value={Math.round(stats?.totalCaloriesBurned || 0)}
          icon={Flame}
          color="bg-orange-500"
          subtitle="Total calories"
        />
        <StatCard
          title="Total Duration"
          value={`${Math.round((stats?.totalDurationMinutes || 0) / 60)}h`}
          icon={Clock}
          color="bg-green-500"
          subtitle="Active time"
        />
        <StatCard
          title="Avg. Calories"
          value={Math.round(stats?.averageCaloriesPerActivity || 0)}
          icon={Target}
          color="bg-purple-500"
          subtitle="Per activity"
        />
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
              <a
                href="/activities"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all
              </a>
            </div>
            
            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No activities yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start tracking your fitness journey!
                </p>
                <div className="mt-6">
                  <a
                    href="/activities/add"
                    className="btn-primary"
                  >
                    Add Activity
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href="/activities/add"
                className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Plus className="h-5 w-5 mr-3 text-primary-600" />
                Track New Activity
              </a>
              <a
                href="/recommendations"
                className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Lightbulb className="h-5 w-5 mr-3 text-primary-600" />
                View Recommendations
              </a>
              <a
                href="/profile"
                className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <User className="h-5 w-5 mr-3 text-primary-600" />
                Update Profile
              </a>
            </div>
          </div>

          {/* Weekly Goal */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Goal</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Activities</span>
                <span className="font-medium">3 / 5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-xs text-gray-500">
                2 more activities to reach your goal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 