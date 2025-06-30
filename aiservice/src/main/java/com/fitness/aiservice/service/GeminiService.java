package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class GeminiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
        this.objectMapper = new ObjectMapper();
    }

    public String getAnswer(String question) {
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[] {
                        Map.of("parts", new Object[]{
                                Map.of("text", question)
                        })
                },
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "topK", 40,
                        "topP", 0.95,
                        "maxOutputTokens", 2048
                )
        );

        return webClient.post()
                .uri(geminiApiUrl + "?key=" + geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public JsonNode getStructuredResponse(String prompt) {
        try {
            String response = getAnswer(prompt);
            JsonNode rootNode = objectMapper.readTree(response);
            
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

            return objectMapper.readTree(jsonContent);
        } catch (Exception e) {
            log.error("Error parsing AI response: ", e);
            throw new RuntimeException("Failed to parse AI response", e);
        }
    }

    public String generateWorkoutPlan(String userProfile, String goals, String fitnessLevel) {
        String prompt = String.format("""
        Create a personalized 7-day workout plan in JSON format:
        {
          "plan": {
            "name": "Personalized Fitness Plan",
            "description": "7-day workout plan tailored to your needs",
            "days": [
              {
                "day": 1,
                "name": "Day Name",
                "focus": "Primary focus area",
                "duration": "45-60 minutes",
                "exercises": [
                  {
                    "name": "Exercise Name",
                    "sets": 3,
                    "reps": "12-15",
                    "rest": "60 seconds",
                    "description": "How to perform"
                  }
                ],
                "tips": ["Tip 1", "Tip 2"]
              }
            ],
            "nutrition": {
              "preWorkout": "What to eat before",
              "postWorkout": "What to eat after",
              "hydration": "Hydration tips"
            }
          }
        }

        User Profile: %s
        Goals: %s
        Fitness Level: %s

        Provide a realistic, progressive plan that matches their fitness level and goals.
        """, userProfile, goals, fitnessLevel);

        return getAnswer(prompt);
    }

    public String generateNutritionAdvice(String activityType, int caloriesBurned, String dietaryRestrictions) {
        String prompt = String.format("""
        Provide personalized nutrition advice in JSON format:
        {
          "nutrition": {
            "preWorkout": {
              "timing": "When to eat",
              "foods": ["Food 1", "Food 2"],
              "avoid": ["Food to avoid"]
            },
            "postWorkout": {
              "timing": "When to eat",
              "foods": ["Food 1", "Food 2"],
              "protein": "Protein recommendation",
              "carbs": "Carb recommendation"
            },
            "hydration": {
              "before": "Hydration before workout",
              "during": "Hydration during workout",
              "after": "Hydration after workout"
            },
            "supplements": ["Supplement 1", "Supplement 2"],
            "tips": ["Tip 1", "Tip 2"]
          }
        }

        Activity Type: %s
        Calories Burned: %d
        Dietary Restrictions: %s

        Provide practical, science-based nutrition advice.
        """, activityType, caloriesBurned, dietaryRestrictions);

        return getAnswer(prompt);
    }

    public String analyzeProgress(List<Map<String, Object>> activities) {
        String activitiesJson = activities.toString();
        String prompt = String.format("""
        Analyze fitness progress and provide insights in JSON format:
        {
          "progress": {
            "overall": "Overall progress assessment",
            "strengths": ["Strength 1", "Strength 2"],
            "weaknesses": ["Weakness 1", "Weakness 2"],
            "trends": {
              "frequency": "Trend in workout frequency",
              "intensity": "Trend in workout intensity",
              "variety": "Trend in exercise variety"
            },
            "recommendations": [
              {
                "area": "Area to focus on",
                "action": "Specific action to take",
                "timeline": "Expected timeline"
              }
            ],
            "milestones": [
              {
                "name": "Milestone name",
                "description": "Description",
                "achieved": false,
                "progress": 75
              }
            ]
          }
        }

        Recent Activities: %s

        Analyze patterns, progress, and provide actionable insights.
        """, activitiesJson);

        return getAnswer(prompt);
    }

    public String generateMotivationalMessage(String userMood, String recentActivity, String goals) {
        String prompt = String.format("""
        Generate a personalized motivational message in JSON format:
        {
          "motivation": {
            "message": "Personalized motivational message",
            "quote": "Inspirational quote",
            "action": "Specific action to take today",
            "mindset": "Mindset advice",
            "encouragement": "Words of encouragement"
          }
        }

        User's Current Mood: %s
        Recent Activity: %s
        Goals: %s

        Provide uplifting, personalized motivation that resonates with their situation.
        """, userMood, recentActivity, goals);

        return getAnswer(prompt);
    }

    public String generateInjuryPreventionAdvice(String activityType, String userAge, String fitnessLevel) {
        String prompt = String.format("""
        Provide injury prevention advice in JSON format:
        {
          "injuryPrevention": {
            "warmup": {
              "duration": "5-10 minutes",
              "exercises": ["Exercise 1", "Exercise 2"],
              "importance": "Why warmup is crucial"
            },
            "technique": {
              "keyPoints": ["Point 1", "Point 2"],
              "commonMistakes": ["Mistake 1", "Mistake 2"],
              "corrections": ["Correction 1", "Correction 2"]
            },
            "recovery": {
              "stretching": ["Stretch 1", "Stretch 2"],
              "rest": "Rest recommendations",
              "signs": ["Warning sign 1", "Warning sign 2"]
            },
            "equipment": {
              "recommended": ["Equipment 1", "Equipment 2"],
              "safety": "Safety guidelines"
            }
          }
        }

        Activity Type: %s
        User Age: %s
        Fitness Level: %s

        Provide comprehensive injury prevention guidance.
        """, activityType, userAge, fitnessLevel);

        return getAnswer(prompt);
    }

    public String generateSocialFeatures(String activityType, String location, String goals) {
        String prompt = String.format("""
        Suggest social fitness features in JSON format:
        {
          "social": {
            "challenges": [
              {
                "name": "Challenge name",
                "description": "Challenge description",
                "duration": "30 days",
                "participants": "Number of participants"
              }
            ],
            "groups": [
              {
                "name": "Group name",
                "focus": "Group focus",
                "meetingTime": "When they meet",
                "location": "Where they meet"
              }
            ],
            "events": [
              {
                "name": "Event name",
                "date": "Event date",
                "location": "Event location",
                "description": "Event description"
              }
            ],
            "tips": ["Social tip 1", "Social tip 2"]
          }
        }

        Activity Type: %s
        Location: %s
        Goals: %s

        Suggest engaging social fitness opportunities.
        """, activityType, location, goals);

        return getAnswer(prompt);
    }
}
