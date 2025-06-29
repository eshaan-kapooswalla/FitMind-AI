package com.fitness.activityservice.service;

import com.fitness.activityservice.ActivityRepository;
import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    @Value("${rabbitmq.routing.key}")
    private String routingKey;

    public ActivityResponse trackActivity(ActivityRequest request) {

        boolean isValidUser = userValidationService.validateUser(request.getUserId());
        if (!isValidUser) {
            throw new RuntimeException("Invalid User: " + request.getUserId());
        }

        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(request.getCaloriesBurned())
                .startTime(request.getStartTime())
                .additionalMetrics(request.getAdditionalMetrics())
                .build();

        Activity savedActivity = activityRepository.save(activity);

        // Publish to RabbitMQ for AI Processing
        try {
            rabbitTemplate.convertAndSend(exchange, routingKey, savedActivity);
        } catch(Exception e) {
            log.error("Failed to publish activity to RabbitMQ : ", e);
        }

        return mapToResponse(savedActivity);
    }

    private ActivityResponse mapToResponse(Activity activity){
        ActivityResponse response = new ActivityResponse();
        response.setId(activity.getId());
        response.setUserId(activity.getUserId());
        response.setType(activity.getType());
        response.setDuration(activity.getDuration());
        response.setCaloriesBurned(activity.getCaloriesBurned());
        response.setStartTime(activity.getStartTime());
        response.setAdditionalMetrics(activity.getAdditionalMetrics());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());
        return response;
    }

    public List<ActivityResponse> getUserActivities(String userId) {
        List<Activity> activities = activityRepository.findByUserId(userId);
        return activities.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ActivityResponse getActivityById(String activityId) {
        return activityRepository.findById(activityId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + activityId));
    }

    public ActivityResponse updateActivity(String activityId, ActivityRequest request) {
        Activity existingActivity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + activityId));
        
        // Verify user owns this activity
        if (!existingActivity.getUserId().equals(request.getUserId())) {
            throw new RuntimeException("User not authorized to update this activity");
        }

        existingActivity.setType(request.getType());
        existingActivity.setDuration(request.getDuration());
        existingActivity.setCaloriesBurned(request.getCaloriesBurned());
        existingActivity.setStartTime(request.getStartTime());
        existingActivity.setAdditionalMetrics(request.getAdditionalMetrics());

        Activity updatedActivity = activityRepository.save(existingActivity);
        return mapToResponse(updatedActivity);
    }

    public void deleteActivity(String activityId, String userId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + activityId));
        
        if (!activity.getUserId().equals(userId)) {
            throw new RuntimeException("User not authorized to delete this activity");
        }

        activityRepository.deleteById(activityId);
    }

    public List<ActivityResponse> getUserActivities(String userId, String activityType, String startDate, String endDate, int page, int size) {
        List<Activity> activities = activityRepository.findByUserId(userId);
        
        // Apply filters if provided
        if (activityType != null && !activityType.isEmpty()) {
            activities = activities.stream()
                    .filter(activity -> activity.getType().toString().equalsIgnoreCase(activityType))
                    .collect(Collectors.toList());
        }
        
        // TODO: Add date filtering logic when startDate and endDate are provided
        
        // Apply pagination
        int start = page * size;
        int end = Math.min(start + size, activities.size());
        
        if (start >= activities.size()) {
            return List.of();
        }
        
        return activities.subList(start, end).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Object getUserStats(String userId, String period) {
        List<Activity> activities = activityRepository.findByUserId(userId);
        
        // Calculate basic stats
        double totalCalories = activities.stream()
                .mapToDouble(Activity::getCaloriesBurned)
                .sum();
        
        long totalDuration = activities.stream()
                .mapToLong(Activity::getDuration)
                .sum();
        
        int totalActivities = activities.size();
        
        // Create stats object
        return Map.of(
            "userId", userId,
            "totalActivities", totalActivities,
            "totalCaloriesBurned", totalCalories,
            "totalDurationMinutes", totalDuration,
            "averageCaloriesPerActivity", totalActivities > 0 ? totalCalories / totalActivities : 0,
            "averageDurationPerActivity", totalActivities > 0 ? totalDuration / totalActivities : 0
        );
    }
}
