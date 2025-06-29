package com.fitness.activityservice.controller;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.service.ActivityService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
@AllArgsConstructor
@Slf4j
@Validated
public class ActivityController {

    private ActivityService activityService;

    @PostMapping
    public ResponseEntity<ActivityResponse> trackActivity(
            @Valid @RequestBody ActivityRequest request, 
            @RequestHeader("X-User-ID") @NotBlank String userId) {
        log.info("Tracking activity for user: {}", userId);
        try {
            request.setUserId(userId);
            ActivityResponse response = activityService.trackActivity(request);
            log.info("Activity tracked successfully for user: {}", userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error tracking activity for user: {}", userId, e);
            throw e;
        }
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getUserActivities(
            @RequestHeader("X-User-ID") @NotBlank String userId,
            @RequestParam(required = false) String activityType,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Fetching activities for user: {} with filters", userId);
        try {
            List<ActivityResponse> activities = activityService.getUserActivities(userId, activityType, startDate, endDate, page, size);
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            log.error("Error fetching activities for user: {}", userId, e);
            throw e;
        }
    }

    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> getActivity(
            @PathVariable @NotBlank String activityId) {
        log.info("Fetching activity with ID: {}", activityId);
        try {
            ActivityResponse activity = activityService.getActivityById(activityId);
            return ResponseEntity.ok(activity);
        } catch (Exception e) {
            log.error("Error fetching activity with ID: {}", activityId, e);
            throw e;
        }
    }

    @PutMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> updateActivity(
            @PathVariable @NotBlank String activityId,
            @Valid @RequestBody ActivityRequest request,
            @RequestHeader("X-User-ID") @NotBlank String userId) {
        log.info("Updating activity: {} for user: {}", activityId, userId);
        try {
            request.setUserId(userId);
            ActivityResponse response = activityService.updateActivity(activityId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error updating activity: {} for user: {}", activityId, userId, e);
            throw e;
        }
    }

    @DeleteMapping("/{activityId}")
    public ResponseEntity<Void> deleteActivity(
            @PathVariable @NotBlank String activityId,
            @RequestHeader("X-User-ID") @NotBlank String userId) {
        log.info("Deleting activity: {} for user: {}", activityId, userId);
        try {
            activityService.deleteActivity(activityId, userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting activity: {} for user: {}", activityId, userId, e);
            throw e;
        }
    }

    @GetMapping("/stats/{userId}")
    public ResponseEntity<Object> getUserStats(
            @PathVariable @NotBlank String userId,
            @RequestParam(required = false) String period) {
        log.info("Fetching stats for user: {} for period: {}", userId, period);
        try {
            Object stats = activityService.getUserStats(userId, period);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching stats for user: {}", userId, e);
            throw e;
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Activity Service is healthy!");
    }
}
