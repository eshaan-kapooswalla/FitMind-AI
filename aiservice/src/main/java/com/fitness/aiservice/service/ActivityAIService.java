package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {
    private final GeminiService geminiService;

    public Recommendation generateRecommendation(Activity activity) {
        String prompt = createPromptForActivity(activity);
        String aiResponse = geminiService.getAnswer(prompt);
        log.info("RESPONSE FROM AI: {} ", aiResponse);
        return processAiResponse(activity, aiResponse);
    }

    public Map<String, Object> generateWorkoutPlan(String userProfile, String goals, String fitnessLevel) {
        try {
            String aiResponse = geminiService.generateWorkoutPlan(userProfile, goals, fitnessLevel);
            JsonNode response = geminiService.getStructuredResponse(aiResponse);
            return new ObjectMapper().convertValue(response, Map.class);
        } catch (Exception e) {
            log.error("Error generating workout plan: ", e);
            return createDefaultWorkoutPlan();
        }
    }

    public Map<String, Object> generateNutritionAdvice(String activityType, int caloriesBurned, String dietaryRestrictions) {
        try {
            String aiResponse = geminiService.generateNutritionAdvice(activityType, caloriesBurned, dietaryRestrictions);
            JsonNode response = geminiService.getStructuredResponse(aiResponse);
            return new ObjectMapper().convertValue(response, Map.class);
        } catch (Exception e) {
            log.error("Error generating nutrition advice: ", e);
            return createDefaultNutritionAdvice();
        }
    }

    public Map<String, Object> analyzeProgress(List<Map<String, Object>> activities) {
        try {
            String aiResponse = geminiService.analyzeProgress(activities);
            JsonNode response = geminiService.getStructuredResponse(aiResponse);
            return new ObjectMapper().convertValue(response, Map.class);
        } catch (Exception e) {
            log.error("Error analyzing progress: ", e);
            return createDefaultProgressAnalysis();
        }
    }

    public Map<String, Object> generateMotivationalMessage(String userMood, String recentActivity, String goals) {
        try {
            String aiResponse = geminiService.generateMotivationalMessage(userMood, recentActivity, goals);
            JsonNode response = geminiService.getStructuredResponse(aiResponse);
            return new ObjectMapper().convertValue(response, Map.class);
        } catch (Exception e) {
            log.error("Error generating motivational message: ", e);
            return createDefaultMotivationalMessage();
        }
    }

    public Map<String, Object> generateInjuryPreventionAdvice(String activityType, String userAge, String fitnessLevel) {
        try {
            String aiResponse = geminiService.generateInjuryPreventionAdvice(activityType, userAge, fitnessLevel);
            JsonNode response = geminiService.getStructuredResponse(aiResponse);
            return new ObjectMapper().convertValue(response, Map.class);
        } catch (Exception e) {
            log.error("Error generating injury prevention advice: ", e);
            return createDefaultInjuryPreventionAdvice();
        }
    }

    public Map<String, Object> generateSocialFeatures(String activityType, String location, String goals) {
        try {
            String aiResponse = geminiService.generateSocialFeatures(activityType, location, goals);
            JsonNode response = geminiService.getStructuredResponse(aiResponse);
            return new ObjectMapper().convertValue(response, Map.class);
        } catch (Exception e) {
            log.error("Error generating social features: ", e);
            return createDefaultSocialFeatures();
        }
    }

    private Recommendation processAiResponse(Activity activity, String aiResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponse);

            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String jsonContent = textNode.asText()
                    .replaceAll("```json\\n","")
                    .replaceAll("\\n```", "")
                    .trim();

//            log.info("PARSED RESPONSE FROM AI: {} ", jsonContent);

            JsonNode analysisJson = mapper.readTree(jsonContent);
            JsonNode analysisNode = analysisJson.path("analysis");
            
            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall:");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace:");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "Heart Rate:");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories:");

            List<String> improvements = extractImprovements(analysisJson.path("improvements"));
            List<String> suggestions = extractSuggestions(analysisJson.path("suggestions"));
            List<String> safety = extractSafetyGuidelines(analysisJson.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    .createdAt(LocalDateTime.now())
                    .build();
            
        } catch (Exception e) {
            e.printStackTrace();
            return createDefaultRecommendation(activity);
        }
    }

    private Recommendation createDefaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .activityType(activity.getType())
                .recommendation("Unable to generate detailed analysis")
                .improvements(Collections.singletonList("Continue with your current routine"))
                .suggestions(Collections.singletonList("Consider consulting a fitness professional"))
                .safety(Arrays.asList(
                        "Always warm up before exercise",
                        "Stay hydrated",
                        "Listen to your body"
                ))
                .createdAt(LocalDateTime.now())
                .build();
    }

    private List<String> extractSafetyGuidelines(JsonNode safetyNode) {
        List<String> safety = new ArrayList<>();
        if (safetyNode.isArray()) {
            safetyNode.forEach(item -> safety.add(item.asText()));
        }
        return safety.isEmpty() ?
                Collections.singletonList("Follow general safety guidelines") :
                safety;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();
        if (suggestionsNode.isArray()) {
            suggestionsNode.forEach(suggestion -> {
                String workout = suggestion.path("workout").asText();
                String description = suggestion.path("description").asText();
                suggestions.add(String.format("%s: %s", workout, description));
            });
        }
        return suggestions.isEmpty() ?
                Collections.singletonList("No specific suggestions provided") :
                suggestions;
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();
        if (improvementsNode.isArray()) {
            improvementsNode.forEach(improvement -> {
                String area = improvement.path("area").asText();
                String detail = improvement.path("recommendation").asText();
                improvements.add(String.format("%s: %s", area, detail));
            });
        }
        return improvements.isEmpty() ?
                Collections.singletonList("No specific improvements provided") :
                improvements;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if (!analysisNode.path(key).isMissingNode()) {
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
        Analyze this fitness activity and provide detailed recommendations in the following EXACT JSON format:
        {
          "analysis": {
            "overall": "Overall analysis here",
            "pace": "Pace analysis here",
            "heartRate": "Heart rate analysis here",
            "caloriesBurned": "Calories analysis here"
          },
          "improvements": [
            {
              "area": "Area name",
              "recommendation": "Detailed recommendation"
            }
          ],
          "suggestions": [
            {
              "workout": "Workout name",
              "description": "Detailed workout description"
            }
          ],
          "safety": [
            "Safety point 1",
            "Safety point 2"
          ]
        }

        Analyze this activity:
        Activity Type: %s
        Duration: %d minutes
        Calories Burned: %d
        Additional Metrics: %s
        
        Provide detailed analysis focusing on performance, improvements, next workout suggestions, and safety guidelines.
        Ensure the response follows the EXACT JSON format shown above.
        """,
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                activity.getAdditionalMetrics()
        );
    }

    private Map<String, Object> createDefaultWorkoutPlan() {
        return Map.of(
            "plan", Map.of(
                "name", "Basic Fitness Plan",
                "description", "A simple 7-day workout plan to get you started",
                "days", Arrays.asList(
                    Map.of("day", 1, "name", "Cardio Day", "focus", "Cardiovascular fitness", "duration", "30 minutes"),
                    Map.of("day", 2, "name", "Strength Day", "focus", "Muscle building", "duration", "45 minutes"),
                    Map.of("day", 3, "name", "Rest Day", "focus", "Recovery", "duration", "0 minutes")
                ),
                "nutrition", Map.of(
                    "preWorkout", "Eat a light meal 2-3 hours before",
                    "postWorkout", "Protein and carbs within 30 minutes",
                    "hydration", "Drink water throughout the day"
                )
            )
        );
    }

    private Map<String, Object> createDefaultNutritionAdvice() {
        return Map.of(
            "nutrition", Map.of(
                "preWorkout", Map.of(
                    "timing", "2-3 hours before",
                    "foods", Arrays.asList("Banana", "Oatmeal", "Greek yogurt"),
                    "avoid", Arrays.asList("Heavy meals", "High fat foods")
                ),
                "postWorkout", Map.of(
                    "timing", "Within 30 minutes",
                    "foods", Arrays.asList("Protein shake", "Chicken breast", "Sweet potato"),
                    "protein", "20-30g protein",
                    "carbs", "30-60g carbs"
                ),
                "hydration", Map.of(
                    "before", "Drink 16-20 oz water",
                    "during", "Drink 7-10 oz every 10-20 minutes",
                    "after", "Drink 20-24 oz for every pound lost"
                ),
                "supplements", Arrays.asList("Multivitamin", "Omega-3"),
                "tips", Arrays.asList("Stay hydrated", "Eat whole foods", "Listen to your body")
            )
        );
    }

    private Map<String, Object> createDefaultProgressAnalysis() {
        return Map.of(
            "progress", Map.of(
                "overall", "You're making good progress! Keep up the consistency.",
                "strengths", Arrays.asList("Consistent workout schedule", "Good form"),
                "weaknesses", Arrays.asList("Could increase intensity", "Need more variety"),
                "trends", Map.of(
                    "frequency", "Improving",
                    "intensity", "Stable",
                    "variety", "Could improve"
                ),
                "recommendations", Arrays.asList(
                    Map.of("area", "Intensity", "action", "Try interval training", "timeline", "2 weeks"),
                    Map.of("area", "Variety", "action", "Add new exercises", "timeline", "1 week")
                ),
                "milestones", Arrays.asList(
                    Map.of("name", "30-day streak", "description", "Workout for 30 consecutive days", "achieved", false, "progress", 60),
                    Map.of("name", "5K run", "description", "Complete a 5K run", "achieved", false, "progress", 40)
                )
            )
        );
    }

    private Map<String, Object> createDefaultMotivationalMessage() {
        return Map.of(
            "motivation", Map.of(
                "message", "Every workout brings you closer to your goals. You've got this!",
                "quote", "The only bad workout is the one that didn't happen.",
                "action", "Take a 10-minute walk today",
                "mindset", "Focus on progress, not perfection",
                "encouragement", "You're stronger than you think. Keep pushing forward!"
            )
        );
    }

    private Map<String, Object> createDefaultInjuryPreventionAdvice() {
        return Map.of(
            "injuryPrevention", Map.of(
                "warmup", Map.of(
                    "duration", "5-10 minutes",
                    "exercises", Arrays.asList("Light jogging", "Arm circles", "Leg swings"),
                    "importance", "Prepares your body for exercise and reduces injury risk"
                ),
                "technique", Map.of(
                    "keyPoints", Arrays.asList("Maintain proper form", "Start with lighter weights"),
                    "commonMistakes", Arrays.asList("Rushing through exercises", "Poor posture"),
                    "corrections", Arrays.asList("Focus on form over speed", "Keep core engaged")
                ),
                "recovery", Map.of(
                    "stretching", Arrays.asList("Hamstring stretch", "Quad stretch", "Chest stretch"),
                    "rest", "Take at least one rest day per week",
                    "signs", Arrays.asList("Persistent pain", "Swelling", "Decreased range of motion")
                ),
                "equipment", Map.of(
                    "recommended", Arrays.asList("Proper shoes", "Supportive clothing"),
                    "safety", "Always check equipment before use"
                )
            )
        );
    }

    private Map<String, Object> createDefaultSocialFeatures() {
        return Map.of(
            "social", Map.of(
                "challenges", Arrays.asList(
                    Map.of("name", "30-Day Fitness Challenge", "description", "Complete 30 days of consistent workouts", "duration", "30 days", "participants", "150+")
                ),
                "groups", Arrays.asList(
                    Map.of("name", "Local Running Club", "focus", "Running and jogging", "meetingTime", "Saturday mornings", "location", "Central Park")
                ),
                "events", Arrays.asList(
                    Map.of("name", "Community 5K", "date", "Next month", "location", "City Center", "description", "Fun run for all fitness levels")
                ),
                "tips", Arrays.asList("Join a local gym", "Find a workout buddy", "Participate in group classes")
            )
        );
    }
}
