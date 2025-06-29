import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Activity, Calendar, Clock, Flame, Save, ArrowLeft } from 'lucide-react'
import { useActivity } from '../contexts/ActivityContext'
import toast from 'react-hot-toast'

const AddActivity = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { addActivity } = useActivity()
  const navigate = useNavigate()

  const activityTypes = [
    { value: 'RUNNING', label: 'Running' },
    { value: 'WALKING', label: 'Walking' },
    { value: 'CYCLING', label: 'Cycling' },
    { value: 'SWIMMING', label: 'Swimming' },
    { value: 'STRENGTH_TRAINING', label: 'Strength Training' },
    { value: 'YOGA', label: 'Yoga' },
    { value: 'PILATES', label: 'Pilates' },
    { value: 'DANCING', label: 'Dancing' },
    { value: 'HIKING', label: 'Hiking' },
    { value: 'TENNIS', label: 'Tennis' },
    { value: 'BASKETBALL', label: 'Basketball' },
    { value: 'SOCCER', label: 'Soccer' },
    { value: 'OTHER', label: 'Other' }
  ]

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      type: 'RUNNING',
      startTime: new Date().toISOString().slice(0, 16),
      duration: 30,
      caloriesBurned: 150
    }
  })

  const selectedType = watch('type')
  const duration = watch('duration')

  // Auto-calculate calories based on activity type and duration
  const calculateCalories = (type, duration) => {
    const caloriesPerMinute = {
      'RUNNING': 10,
      'WALKING': 4,
      'CYCLING': 8,
      'SWIMMING': 9,
      'STRENGTH_TRAINING': 6,
      'YOGA': 3,
      'PILATES': 3,
      'DANCING': 7,
      'HIKING': 6,
      'TENNIS': 8,
      'BASKETBALL': 9,
      'SOCCER': 8,
      'OTHER': 5
    }
    return Math.round((caloriesPerMinute[type] || 5) * duration)
  }

  const handleTypeChange = (e) => {
    const newType = e.target.value
    setValue('type', newType)
    const newCalories = calculateCalories(newType, duration)
    setValue('caloriesBurned', newCalories)
  }

  const handleDurationChange = (e) => {
    const newDuration = parseInt(e.target.value)
    setValue('duration', newDuration)
    const newCalories = calculateCalories(selectedType, newDuration)
    setValue('caloriesBurned', newCalories)
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await addActivity({
        ...data,
        startTime: new Date(data.startTime).toISOString(),
        duration: parseInt(data.duration),
        caloriesBurned: parseFloat(data.caloriesBurned)
      })
      navigate('/activities')
    } catch (error) {
      console.error('Error adding activity:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/activities')}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Activity</h1>
          <p className="text-gray-600 mt-1">
            Track your fitness activity and progress
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Activity Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {activityTypes.map((type) => (
                <label
                  key={type.value}
                  className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                    selectedType === type.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    value={type.value}
                    {...register('type', { required: 'Activity type is required' })}
                    onChange={handleTypeChange}
                    className="sr-only"
                  />
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <p className={`font-medium ${
                          selectedType === type.value ? 'text-primary-900' : 'text-gray-900'
                        }`}>
                          {type.label}
                        </p>
                      </div>
                    </div>
                    {selectedType === type.value && (
                      <div className="shrink-0 text-primary-600">
                        <Activity className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date & Time
              </label>
              <input
                type="datetime-local"
                {...register('startTime', { required: 'Start time is required' })}
                className="input-field"
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="480"
                {...register('duration', { 
                  required: 'Duration is required',
                  min: { value: 1, message: 'Duration must be at least 1 minute' },
                  max: { value: 480, message: 'Duration cannot exceed 8 hours' }
                })}
                onChange={handleDurationChange}
                className="input-field"
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
              )}
            </div>
          </div>

          {/* Calories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Flame className="inline h-4 w-4 mr-1" />
              Calories Burned
            </label>
            <input
              type="number"
              min="1"
              step="0.1"
              {...register('caloriesBurned', { 
                required: 'Calories burned is required',
                min: { value: 1, message: 'Calories must be at least 1' }
              })}
              className="input-field"
            />
            <p className="mt-1 text-xs text-gray-500">
              Estimated based on activity type and duration
            </p>
            {errors.caloriesBurned && (
              <p className="mt-1 text-sm text-red-600">{errors.caloriesBurned.message}</p>
            )}
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              {...register('additionalMetrics.notes')}
              rows={3}
              className="input-field"
              placeholder="How did you feel? Any specific details about your workout?"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/activities')}
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
              Save Activity
            </button>
          </div>
        </form>
      </div>

      {/* Preview Card */}
      <div className="card max-w-2xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Preview</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 capitalize">
                {selectedType?.toLowerCase().replace('_', ' ')}
              </h4>
              <p className="text-sm text-gray-500">
                {watch('startTime') ? new Date(watch('startTime')).toLocaleString() : 'Not set'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{duration} min</p>
              <p className="text-sm text-gray-500">{Math.round(watch('caloriesBurned'))} cal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddActivity 