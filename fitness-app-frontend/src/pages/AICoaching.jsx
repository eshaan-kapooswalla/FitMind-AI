import { useState, useEffect } from 'react'
import { 
  Brain, 
  Dumbbell, 
  Apple, 
  TrendingUp, 
  Heart,
  Users,
  Target,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { recommendationService } from '../services/recommendationService'
import toast from 'react-hot-toast'

const AICoaching = () => {
  const [activeTab, setActiveTab] = useState('workout')
  const [loading, setLoading] = useState(false)
  const [workoutPlan, setWorkoutPlan] = useState(null)
  const [nutritionAdvice, setNutritionAdvice] = useState(null)
  const [progressAnalysis, setProgressAnalysis] = useState(null)
  const [motivation, setMotivation] = useState(null)
  const [injuryPrevention, setInjuryPrevention] = useState(null)
  const [socialFeatures, setSocialFeatures] = useState(null)
  const [expandedSections, setExpandedSections] = useState({})

  const tabs = [
    { id: 'workout', name: 'Workout Plan', icon: Dumbbell },
    { id: 'nutrition', name: 'Nutrition', icon: Apple },
    { id: 'progress', name: 'Progress Analysis', icon: TrendingUp },
    { id: 'motivation', name: 'Motivation', icon: Heart },
    { id: 'injury', name: 'Injury Prevention', icon: Target },
    { id: 'social', name: 'Social Features', icon: Users }
  ]

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const generateWorkoutPlan = async () => {
    setLoading(true)
    try {
      const plan = await recommendationService.generateWorkoutPlan(
        'Active individual looking to improve fitness',
        'Build strength and improve cardiovascular health',
        'Intermediate'
      )
      setWorkoutPlan(plan)
      toast.success('Workout plan generated!')
    } catch (error) {
      toast.error('Failed to generate workout plan')
    } finally {
      setLoading(false)
    }
  }

  const generateNutritionAdvice = async () => {
    setLoading(true)
    try {
      const advice = await recommendationService.generateNutritionAdvice(
        'Mixed activities',
        500,
        'None'
      )
      setNutritionAdvice(advice)
      toast.success('Nutrition advice generated!')
    } catch (error) {
      toast.error('Failed to generate nutrition advice')
    } finally {
      setLoading(false)
    }
  }

  const analyzeProgress = async () => {
    setLoading(true)
    try {
      const analysis = await recommendationService.analyzeProgress([
        { type: 'RUNNING', duration: 30, caloriesBurned: 300 },
        { type: 'STRENGTH', duration: 45, caloriesBurned: 250 },
        { type: 'YOGA', duration: 60, caloriesBurned: 200 }
      ])
      setProgressAnalysis(analysis)
      toast.success('Progress analysis completed!')
    } catch (error) {
      toast.error('Failed to analyze progress')
    } finally {
      setLoading(false)
    }
  }

  const generateMotivation = async () => {
    setLoading(true)
    try {
      const motivational = await recommendationService.generateMotivationalMessage(
        'Motivated',
        'Recent workout session',
        'Improve overall fitness'
      )
      setMotivation(motivational)
      toast.success('Motivational message generated!')
    } catch (error) {
      toast.error('Failed to generate motivation')
    } finally {
      setLoading(false)
    }
  }

  const generateInjuryPrevention = async () => {
    setLoading(true)
    try {
      const prevention = await recommendationService.generateInjuryPreventionAdvice(
        'Mixed activities',
        '25-35',
        'Intermediate'
      )
      setInjuryPrevention(prevention)
      toast.success('Injury prevention advice generated!')
    } catch (error) {
      toast.error('Failed to generate injury prevention advice')
    } finally {
      setLoading(false)
    }
  }

  const generateSocialFeatures = async () => {
    setLoading(true)
    try {
      const social = await recommendationService.generateSocialFeatures(
        'Mixed activities',
        'Local area',
        'Improve fitness and meet people'
      )
      setSocialFeatures(social)
      toast.success('Social features generated!')
    } catch (error) {
      toast.error('Failed to generate social features')
    } finally {
      setLoading(false)
    }
  }

  const renderWorkoutPlan = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Personalized Workout Plan</h2>
        <button
          onClick={generateWorkoutPlan}
          disabled={loading}
          className="btn-primary inline-flex items-center"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Generate Plan
        </button>
      </div>

      {workoutPlan && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">{workoutPlan.plan?.name}</h3>
            <p className="text-gray-600">{workoutPlan.plan?.description}</p>
          </div>

          {workoutPlan.plan?.days?.map((day, index) => (
            <div key={index} className="card">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Day {day.day}: {day.name}</h4>
                <span className="text-sm text-gray-500">{day.duration}</span>
              </div>
              <p className="text-gray-600 mb-3">Focus: {day.focus}</p>
              
              {day.exercises && (
                <div className="space-y-2">
                  <h5 className="font-medium">Exercises:</h5>
                  {day.exercises.map((exercise, exIndex) => (
                    <div key={exIndex} className="bg-gray-50 p-3 rounded">
                      <div className="font-medium">{exercise.name}</div>
                      <div className="text-sm text-gray-600">
                        {exercise.sets} sets × {exercise.reps} reps
                      </div>
                      <div className="text-sm text-gray-500">Rest: {exercise.rest}</div>
                    </div>
                  ))}
                </div>
              )}

              {day.tips && (
                <div className="mt-3">
                  <h5 className="font-medium mb-2">Tips:</h5>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {day.tips.map((tip, tipIndex) => (
                      <li key={tipIndex}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {workoutPlan.plan?.nutrition && (
            <div className="card">
              <h4 className="font-semibold mb-3">Nutrition Guidelines</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium text-sm text-gray-600">Pre-Workout</h5>
                  <p className="text-sm">{workoutPlan.plan.nutrition.preWorkout}</p>
                </div>
                <div>
                  <h5 className="font-medium text-sm text-gray-600">Post-Workout</h5>
                  <p className="text-sm">{workoutPlan.plan.nutrition.postWorkout}</p>
                </div>
                <div>
                  <h5 className="font-medium text-sm text-gray-600">Hydration</h5>
                  <p className="text-sm">{workoutPlan.plan.nutrition.hydration}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  const renderNutritionAdvice = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Nutrition Advice</h2>
        <button
          onClick={generateNutritionAdvice}
          disabled={loading}
          className="btn-primary inline-flex items-center"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Generate Advice
        </button>
      </div>

      {nutritionAdvice && (
        <div className="space-y-4">
          {nutritionAdvice.nutrition?.preWorkout && (
            <div className="card">
              <h3 className="font-semibold mb-3">Pre-Workout Nutrition</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Timing:</span> {nutritionAdvice.nutrition.preWorkout.timing}</p>
                <div>
                  <span className="font-medium">Recommended Foods:</span>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {nutritionAdvice.nutrition.preWorkout.foods?.map((food, index) => (
                      <li key={index}>{food}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-medium">Avoid:</span>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {nutritionAdvice.nutrition.preWorkout.avoid?.map((food, index) => (
                      <li key={index}>{food}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {nutritionAdvice.nutrition?.postWorkout && (
            <div className="card">
              <h3 className="font-semibold mb-3">Post-Workout Nutrition</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Timing:</span> {nutritionAdvice.nutrition.postWorkout.timing}</p>
                <div>
                  <span className="font-medium">Recommended Foods:</span>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {nutritionAdvice.nutrition.postWorkout.foods?.map((food, index) => (
                      <li key={index}>{food}</li>
                    ))}
                  </ul>
                </div>
                <p><span className="font-medium">Protein:</span> {nutritionAdvice.nutrition.postWorkout.protein}</p>
                <p><span className="font-medium">Carbs:</span> {nutritionAdvice.nutrition.postWorkout.carbs}</p>
              </div>
            </div>
          )}

          {nutritionAdvice.nutrition?.hydration && (
            <div className="card">
              <h3 className="font-semibold mb-3">Hydration Guidelines</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Before:</span> {nutritionAdvice.nutrition.hydration.before}</p>
                <p><span className="font-medium">During:</span> {nutritionAdvice.nutrition.hydration.during}</p>
                <p><span className="font-medium">After:</span> {nutritionAdvice.nutrition.hydration.after}</p>
              </div>
            </div>
          )}

          {nutritionAdvice.nutrition?.supplements && (
            <div className="card">
              <h3 className="font-semibold mb-3">Supplements</h3>
              <ul className="list-disc list-inside">
                {nutritionAdvice.nutrition.supplements?.map((supplement, index) => (
                  <li key={index}>{supplement}</li>
                ))}
              </ul>
            </div>
          )}

          {nutritionAdvice.nutrition?.tips && (
            <div className="card">
              <h3 className="font-semibold mb-3">General Tips</h3>
              <ul className="list-disc list-inside">
                {nutritionAdvice.nutrition.tips?.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )

  const renderProgressAnalysis = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Progress Analysis</h2>
        <button
          onClick={analyzeProgress}
          disabled={loading}
          className="btn-primary inline-flex items-center"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Analyze Progress
        </button>
      </div>

      {progressAnalysis && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-3">Overall Assessment</h3>
            <p className="text-gray-700">{progressAnalysis.progress?.overall}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <h4 className="font-semibold mb-3 text-green-600">Strengths</h4>
              <ul className="list-disc list-inside space-y-1">
                {progressAnalysis.progress?.strengths?.map((strength, index) => (
                  <li key={index} className="text-sm">{strength}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h4 className="font-semibold mb-3 text-orange-600">Areas for Improvement</h4>
              <ul className="list-disc list-inside space-y-1">
                {progressAnalysis.progress?.weaknesses?.map((weakness, index) => (
                  <li key={index} className="text-sm">{weakness}</li>
                ))}
              </ul>
            </div>
          </div>

          {progressAnalysis.progress?.trends && (
            <div className="card">
              <h4 className="font-semibold mb-3">Trends</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="font-medium text-sm text-gray-600">Frequency:</span>
                  <p className="text-sm">{progressAnalysis.progress.trends.frequency}</p>
                </div>
                <div>
                  <span className="font-medium text-sm text-gray-600">Intensity:</span>
                  <p className="text-sm">{progressAnalysis.progress.trends.intensity}</p>
                </div>
                <div>
                  <span className="font-medium text-sm text-gray-600">Variety:</span>
                  <p className="text-sm">{progressAnalysis.progress.trends.variety}</p>
                </div>
              </div>
            </div>
          )}

          {progressAnalysis.progress?.recommendations && (
            <div className="card">
              <h4 className="font-semibold mb-3">Recommendations</h4>
              <div className="space-y-3">
                {progressAnalysis.progress.recommendations?.map((rec, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-medium">{rec.area}</h5>
                    <p className="text-sm text-gray-600">{rec.action}</p>
                    <p className="text-xs text-gray-500">Timeline: {rec.timeline}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {progressAnalysis.progress?.milestones && (
            <div className="card">
              <h4 className="font-semibold mb-3">Milestones</h4>
              <div className="space-y-3">
                {progressAnalysis.progress.milestones?.map((milestone, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">{milestone.name}</h5>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{milestone.progress}%</div>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${milestone.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  const renderMotivation = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daily Motivation</h2>
        <button
          onClick={generateMotivation}
          disabled={loading}
          className="btn-primary inline-flex items-center"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Get Motivated
        </button>
      </div>

      {motivation && (
        <div className="space-y-4">
          <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Today's Motivation</h3>
              <p className="text-lg mb-4">{motivation.motivation?.message}</p>
              <div className="text-sm opacity-90">"{motivation.motivation?.quote}"</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <h4 className="font-semibold mb-3">Today's Action</h4>
              <p className="text-gray-700">{motivation.motivation?.action}</p>
            </div>

            <div className="card">
              <h4 className="font-semibold mb-3">Mindset</h4>
              <p className="text-gray-700">{motivation.motivation?.mindset}</p>
            </div>
          </div>

          <div className="card bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-3 text-blue-800">Encouragement</h4>
            <p className="text-blue-700">{motivation.motivation?.encouragement}</p>
          </div>
        </div>
      )}
    </div>
  )

  const renderInjuryPrevention = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Injury Prevention</h2>
        <button
          onClick={generateInjuryPrevention}
          disabled={loading}
          className="btn-primary inline-flex items-center"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Get Advice
        </button>
      </div>

      {injuryPrevention && (
        <div className="space-y-4">
          {injuryPrevention.injuryPrevention?.warmup && (
            <div className="card">
              <h3 className="font-semibold mb-3">Warm-up Routine</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Duration:</span> {injuryPrevention.injuryPrevention.warmup.duration}</p>
                <p><span className="font-medium">Importance:</span> {injuryPrevention.injuryPrevention.warmup.importance}</p>
                <div>
                  <span className="font-medium">Exercises:</span>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {injuryPrevention.injuryPrevention.warmup.exercises?.map((exercise, index) => (
                      <li key={index}>{exercise}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {injuryPrevention.injuryPrevention?.technique && (
            <div className="card">
              <h3 className="font-semibold mb-3">Proper Technique</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Key Points:</span>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {injuryPrevention.injuryPrevention.technique.keyPoints?.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-medium">Common Mistakes:</span>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {injuryPrevention.injuryPrevention.technique.commonMistakes?.map((mistake, index) => (
                      <li key={index}>{mistake}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-medium">Corrections:</span>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {injuryPrevention.injuryPrevention.technique.corrections?.map((correction, index) => (
                      <li key={index}>{correction}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {injuryPrevention.injuryPrevention?.recovery && (
            <div className="card">
              <h3 className="font-semibold mb-3">Recovery & Rest</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Stretching:</span>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {injuryPrevention.injuryPrevention.recovery.stretching?.map((stretch, index) => (
                      <li key={index}>{stretch}</li>
                    ))}
                  </ul>
                </div>
                <p><span className="font-medium">Rest:</span> {injuryPrevention.injuryPrevention.recovery.rest}</p>
                <div>
                  <span className="font-medium">Warning Signs:</span>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {injuryPrevention.injuryPrevention.recovery.signs?.map((sign, index) => (
                      <li key={index}>{sign}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {injuryPrevention.injuryPrevention?.equipment && (
            <div className="card">
              <h3 className="font-semibold mb-3">Equipment & Safety</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Recommended Equipment:</span>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {injuryPrevention.injuryPrevention.equipment.recommended?.map((equipment, index) => (
                      <li key={index}>{equipment}</li>
                    ))}
                  </ul>
                </div>
                <p><span className="font-medium">Safety Guidelines:</span> {injuryPrevention.injuryPrevention.equipment.safety}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  const renderSocialFeatures = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Social Fitness</h2>
        <button
          onClick={generateSocialFeatures}
          disabled={loading}
          className="btn-primary inline-flex items-center"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Find Opportunities
        </button>
      </div>

      {socialFeatures && (
        <div className="space-y-4">
          {socialFeatures.social?.challenges && (
            <div className="card">
              <h3 className="font-semibold mb-3">Fitness Challenges</h3>
              <div className="space-y-3">
                {socialFeatures.social.challenges?.map((challenge, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium">{challenge.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>Duration: {challenge.duration}</span>
                      <span>{challenge.participants} participants</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {socialFeatures.social?.groups && (
            <div className="card">
              <h3 className="font-semibold mb-3">Local Groups</h3>
              <div className="space-y-3">
                {socialFeatures.social.groups?.map((group, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium">{group.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">Focus: {group.focus}</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>{group.meetingTime}</span>
                      <span>{group.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {socialFeatures.social?.events && (
            <div className="card">
              <h3 className="font-semibold mb-3">Upcoming Events</h3>
              <div className="space-y-3">
                {socialFeatures.social.events?.map((event, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium">{event.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>{event.date}</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {socialFeatures.social?.tips && (
            <div className="card">
              <h3 className="font-semibold mb-3">Social Fitness Tips</h3>
              <ul className="list-disc list-inside space-y-1">
                {socialFeatures.social.tips?.map((tip, index) => (
                  <li key={index} className="text-sm">{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'workout':
        return renderWorkoutPlan()
      case 'nutrition':
        return renderNutritionAdvice()
      case 'progress':
        return renderProgressAnalysis()
      case 'motivation':
        return renderMotivation()
      case 'injury':
        return renderInjuryPrevention()
      case 'social':
        return renderSocialFeatures()
      default:
        return renderWorkoutPlan()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Fitness Coach</h1>
          <p className="text-gray-600">Powered by Gemini AI - Your personal fitness companion</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm inline-flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {renderContent()}
      </div>
    </div>
  )
}

export default AICoaching 