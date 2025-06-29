import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { 
  User, 
  Mail, 
  Calendar, 
  Target, 
  Settings, 
  Bell,
  Shield,
  Save,
  Camera
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      age: 25,
      weight: 70,
      height: 170,
      fitnessGoal: 'GENERAL_FITNESS',
      activityLevel: 'MODERATE'
    }
  })

  const fitnessGoals = [
    { value: 'GENERAL_FITNESS', label: 'General Fitness' },
    { value: 'WEIGHT_LOSS', label: 'Weight Loss' },
    { value: 'MUSCLE_GAIN', label: 'Muscle Gain' },
    { value: 'ENDURANCE', label: 'Endurance Training' },
    { value: 'STRENGTH', label: 'Strength Training' }
  ]

  const activityLevels = [
    { value: 'SEDENTARY', label: 'Sedentary (Little or no exercise)' },
    { value: 'LIGHT', label: 'Light (1-3 days/week)' },
    { value: 'MODERATE', label: 'Moderate (3-5 days/week)' },
    { value: 'ACTIVE', label: 'Active (6-7 days/week)' },
    { value: 'VERY_ACTIVE', label: 'Very Active (Hard exercise daily)' }
  ]

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Here you would typically update the user profile via API
      console.log('Profile data:', data)
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary mt-4 sm:mt-0"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="card">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-700 font-medium text-xl">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-1 bg-primary-600 text-white rounded-full hover:bg-primary-700">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user?.name || 'User'}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <p className="text-sm text-gray-400">Member since {new Date().getFullYear()}</p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className="input-field"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="input-field"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      min="13"
                      max="120"
                      {...register('age', { 
                        required: 'Age is required',
                        min: { value: 13, message: 'Age must be at least 13' },
                        max: { value: 120, message: 'Age cannot exceed 120' }
                      })}
                      className="input-field"
                    />
                    {errors.age && (
                      <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="30"
                      max="300"
                      {...register('weight', { 
                        required: 'Weight is required',
                        min: { value: 30, message: 'Weight must be at least 30kg' },
                        max: { value: 300, message: 'Weight cannot exceed 300kg' }
                      })}
                      className="input-field"
                    />
                    {errors.weight && (
                      <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="250"
                      {...register('height', { 
                        required: 'Height is required',
                        min: { value: 100, message: 'Height must be at least 100cm' },
                        max: { value: 250, message: 'Height cannot exceed 250cm' }
                      })}
                      className="input-field"
                    />
                    {errors.height && (
                      <p className="mt-1 text-sm text-red-600">{errors.height.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fitness Goal
                    </label>
                    <select
                      {...register('fitnessGoal', { required: 'Fitness goal is required' })}
                      className="input-field"
                    >
                      {fitnessGoals.map(goal => (
                        <option key={goal.value} value={goal.value}>
                          {goal.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity Level
                    </label>
                    <select
                      {...register('activityLevel', { required: 'Activity level is required' })}
                      className="input-field"
                    >
                      {activityLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary inline-flex items-center"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p className="text-lg text-gray-900">25 years</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Weight</p>
                  <p className="text-lg text-gray-900">70 kg</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Height</p>
                  <p className="text-lg text-gray-900">170 cm</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Fitness Goal</p>
                  <p className="text-lg text-gray-900">General Fitness</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Activity Level</p>
                  <p className="text-lg text-gray-900">Moderate</p>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Notifications</p>
                    <p className="text-sm text-gray-500">Manage your notification preferences</p>
                  </div>
                </div>
                <button className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                  Configure
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Privacy</p>
                    <p className="text-sm text-gray-500">Control your data and privacy settings</p>
                  </div>
                </div>
                <button className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                  Manage
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Account Settings</p>
                    <p className="text-sm text-gray-500">Change password and account details</p>
                  </div>
                </div>
                <button className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <StatCard
            title="Total Activities"
            value="24"
            icon={Target}
            color="bg-blue-500"
          />
          <StatCard
            title="This Month"
            value="8"
            icon={Calendar}
            color="bg-green-500"
          />
          <StatCard
            title="Calories Burned"
            value="12,450"
            icon={Target}
            color="bg-orange-500"
          />

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                Export Data
              </button>
              <button className="w-full text-left p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                Download Report
              </button>
              <button className="w-full text-left p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                Share Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 