package com.fitness.aiservice.controller;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.service.ActivityAIService;
import com.fitness.aiservice.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final ActivityAIService activityAIService;
    private final RecommendationService recommendationService;

    @PostMapping("/recommendations")
    public ResponseEntity<Recommendation> generateRecommendation(@RequestBody Activity activity) {
        try {
            log.info("Generating AI recommendation for activity: {}", activity.getId());
            Recommendation recommendation = activityAIService.generateRecommendation(activity);
            return ResponseEntity.ok(recommendation);
        } catch (Exception e) {
            log.error("Error generating recommendation: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/recommendations/{userId}")
    public ResponseEntity<List<Recommendation>> getUserRecommendations(@PathVariable String userId) {
        try {
            List<Recommendation> recommendations = recommendationService.getUserRecommendation(userId);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            log.error("Error fetching recommendations: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/workout-plan")
    public ResponseEntity<Map<String, Object>> generateWorkoutPlan(
            @RequestBody Map<String, String> request) {
        try {
            String userProfile = request.get("userProfile");
            String goals = request.get("goals");
            String fitnessLevel = request.get("fitnessLevel");
            
            log.info("Generating workout plan for user with goals: {}", goals);
            Map<String, Object> workoutPlan = activityAIService.generateWorkoutPlan(userProfile, goals, fitnessLevel);
            return ResponseEntity.ok(workoutPlan);
        } catch (Exception e) {
            log.error("Error generating workout plan: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/nutrition-advice")
    public ResponseEntity<Map<String, Object>> generateNutritionAdvice(
            @RequestBody Map<String, Object> request) {
        try {
            String activityType = (String) request.get("activityType");
            Integer caloriesBurned = (Integer) request.get("caloriesBurned");
            String dietaryRestrictions = (String) request.get("dietaryRestrictions");
            
            log.info("Generating nutrition advice for {} activity with {} calories", activityType, caloriesBurned);
            Map<String, Object> nutritionAdvice = activityAIService.generateNutritionAdvice(
                activityType, caloriesBurned, dietaryRestrictions);
            return ResponseEntity.ok(nutritionAdvice);
        } catch (Exception e) {
            log.error("Error generating nutrition advice: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/progress-analysis")
    public ResponseEntity<Map<String, Object>> analyzeProgress(
            @RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> activities = (List<Map<String, Object>>) request.get("activities");
            
            log.info("Analyzing progress for {} activities", activities.size());
            Map<String, Object> progressAnalysis = activityAIService.analyzeProgress(activities);
            return ResponseEntity.ok(progressAnalysis);
        } catch (Exception e) {
            log.error("Error analyzing progress: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/motivation")
    public ResponseEntity<Map<String, Object>> generateMotivationalMessage(
            @RequestBody Map<String, String> request) {
        try {
            String userMood = request.get("userMood");
            String recentActivity = request.get("recentActivity");
            String goals = request.get("goals");
            
            log.info("Generating motivational message for user mood: {}", userMood);
            Map<String, Object> motivation = activityAIService.generateMotivationalMessage(
                userMood, recentActivity, goals);
            return ResponseEntity.ok(motivation);
        } catch (Exception e) {
            log.error("Error generating motivational message: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/injury-prevention")
    public ResponseEntity<Map<String, Object>> generateInjuryPreventionAdvice(
            @RequestBody Map<String, String> request) {
        try {
            String activityType = request.get("activityType");
            String userAge = request.get("userAge");
            String fitnessLevel = request.get("fitnessLevel");
            
            log.info("Generating injury prevention advice for {} activity", activityType);
            Map<String, Object> injuryAdvice = activityAIService.generateInjuryPreventionAdvice(
                activityType, userAge, fitnessLevel);
            return ResponseEntity.ok(injuryAdvice);
        } catch (Exception e) {
            log.error("Error generating injury prevention advice: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/social-features")
    public ResponseEntity<Map<String, Object>> generateSocialFeatures(
            @RequestBody Map<String, String> request) {
        try {
            String activityType = request.get("activityType");
            String location = request.get("location");
            String goals = request.get("goals");
            
            log.info("Generating social features for {} activity in {}", activityType, location);
            Map<String, Object> socialFeatures = activityAIService.generateSocialFeatures(
                activityType, location, goals);
            return ResponseEntity.ok(socialFeatures);
        } catch (Exception e) {
            log.error("Error generating social features: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/personalized-coaching")
    public ResponseEntity<Map<String, Object>> getPersonalizedCoaching(
            @RequestBody Map<String, Object> request) {
        try {
            String userId = (String) request.get("userId");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> recentActivities = (List<Map<String, Object>>) request.get("recentActivities");
            String currentGoals = (String) request.get("currentGoals");
            String fitnessLevel = (String) request.get("fitnessLevel");
            
            log.info("Generating personalized coaching for user: {}", userId);
            
            // Generate comprehensive coaching plan
            Map<String, Object> coaching = Map.of(
                "workoutPlan", activityAIService.generateWorkoutPlan(
                    "User with recent activities", currentGoals, fitnessLevel),
                "nutritionAdvice", activityAIService.generateNutritionAdvice(
                    "Mixed activities", 500, "None"),
                "progressAnalysis", activityAIService.analyzeProgress(recentActivities),
                "motivation", activityAIService.generateMotivationalMessage(
                    "Motivated", "Recent workout", currentGoals),
                "injuryPrevention", activityAIService.generateInjuryPreventionAdvice(
                    "Mixed activities", "25-35", fitnessLevel),
                "socialFeatures", activityAIService.generateSocialFeatures(
                    "Mixed activities", "Local area", currentGoals)
            );
            
            return ResponseEntity.ok(coaching);
        } catch (Exception e) {
            log.error("Error generating personalized coaching: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "AI Service is running", "ai", "Gemini AI"));
    }
}
