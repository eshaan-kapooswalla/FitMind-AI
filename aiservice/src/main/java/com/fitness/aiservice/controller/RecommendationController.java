package com.fitness.aiservice.controller;

import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recommendations")
@Slf4j
@Validated
public class RecommendationController {
    // Service to handle recommendation logic
    private final RecommendationService recommendationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Recommendation>> fetchRecommendationsForUser(
            @PathVariable @NotBlank String userId,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Fetching recommendations for user: {} with category: {}", userId, category);
        try {
            List<Recommendation> userRecommendations = recommendationService.getUserRecommendation(userId, category, limit);
            return ResponseEntity.ok(userRecommendations);
        } catch (Exception e) {
            log.error("Error fetching recommendations for user: {}", userId, e);
            throw e;
        }
    }

    @GetMapping("/activity/{activityId}")
    public ResponseEntity<Recommendation> fetchRecommendationForActivity(
            @PathVariable @NotBlank String activityId) {
        log.info("Fetching recommendation for activity: {}", activityId);
        try {
            Recommendation activityRecommendation = recommendationService.getActivityRecommendation(activityId);
            return ResponseEntity.ok(activityRecommendation);
        } catch (Exception e) {
            log.error("Error fetching recommendation for activity: {}", activityId, e);
            throw e;
        }
    }

    @PostMapping("/generate/{userId}")
    public ResponseEntity<List<Recommendation>> generateNewRecommendations(
            @PathVariable @NotBlank String userId,
            @RequestParam(required = false) String focusArea) {
        log.info("Generating new recommendations for user: {} with focus area: {}", userId, focusArea);
        try {
            List<Recommendation> newRecommendations = recommendationService.generateRecommendations(userId, focusArea);
            return ResponseEntity.ok(newRecommendations);
        } catch (Exception e) {
            log.error("Error generating recommendations for user: {}", userId, e);
            throw e;
        }
    }

    @PutMapping("/{recommendationId}/feedback")
    public ResponseEntity<Recommendation> updateRecommendationFeedback(
            @PathVariable @NotBlank String recommendationId,
            @RequestBody Map<String, Object> feedback) {
        log.info("Updating feedback for recommendation: {}", recommendationId);
        try {
            Recommendation updatedRecommendation = recommendationService.updateFeedback(recommendationId, feedback);
            return ResponseEntity.ok(updatedRecommendation);
        } catch (Exception e) {
            log.error("Error updating feedback for recommendation: {}", recommendationId, e);
            throw e;
        }
    }

    @GetMapping("/insights/{userId}")
    public ResponseEntity<Map<String, Object>> getUserInsights(
            @PathVariable @NotBlank String userId,
            @RequestParam(required = false) String timeRange) {
        log.info("Fetching insights for user: {} with time range: {}", userId, timeRange);
        try {
            Map<String, Object> insights = recommendationService.getUserInsights(userId, timeRange);
            return ResponseEntity.ok(insights);
        } catch (Exception e) {
            log.error("Error fetching insights for user: {}", userId, e);
            throw e;
        }
    }

    @GetMapping("/trends/{userId}")
    public ResponseEntity<Map<String, Object>> getUserTrends(
            @PathVariable @NotBlank String userId,
            @RequestParam(defaultValue = "30") int days) {
        log.info("Fetching trends for user: {} for last {} days", userId, days);
        try {
            Map<String, Object> trends = recommendationService.getUserTrends(userId, days);
            return ResponseEntity.ok(trends);
        } catch (Exception e) {
            log.error("Error fetching trends for user: {}", userId, e);
            throw e;
        }
    }

    @DeleteMapping("/{recommendationId}")
    public ResponseEntity<Void> deleteRecommendation(
            @PathVariable @NotBlank String recommendationId,
            @RequestParam @NotBlank String userId) {
        log.info("Deleting recommendation: {} for user: {}", recommendationId, userId);
        try {
            recommendationService.deleteRecommendation(recommendationId, userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting recommendation: {} for user: {}", recommendationId, userId, e);
            throw e;
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        log.info("AI Service health check");
        try {
            Map<String, Object> healthStatus = Map.of(
                "status", "healthy",
                "service", "AI Recommendation Service",
                "timestamp", System.currentTimeMillis()
            );
            return ResponseEntity.ok(healthStatus);
        } catch (Exception e) {
            log.error("Health check failed", e);
            throw e;
        }
    }
}
