package com.fitnesstracker.dashboard.service;

import com.fitnesstracker.auth.model.User;
import com.fitnesstracker.auth.repository.UserRepository;
import com.fitnesstracker.workout.model.Workout;
import com.fitnesstracker.workout.repository.WorkoutRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Service
public class DashboardService {
    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public UserStats getUserStats(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        List<Workout> workouts = workoutRepository.findByUserId(user.getId());

        int totalWorkouts = workouts.size();
        int totalDurationMinutes = workouts.stream().mapToInt(Workout::getDurationMinutes).sum();

        int totalCaloriesBurned = 0;
        for (Workout workout : workouts) {
            if (workout.getExercises() == null || workout.getExercises().isEmpty()) {
                totalCaloriesBurned += workout.getDurationMinutes() * 7; // Default to Medium (7 cal/min)
                continue;
            }

            double totalBurnRate = 0;
            for (com.fitnesstracker.exercise.model.Exercise exercise : workout.getExercises()) {
                String intensity = exercise.getIntensity();
                if ("LOW".equalsIgnoreCase(intensity)) {
                    totalBurnRate += 4;
                } else if ("HIGH".equalsIgnoreCase(intensity)) {
                    totalBurnRate += 10;
                } else {
                    totalBurnRate += 7; // Medium or Default
                }
            }
            // Average burn rate of exercises in the workout
            double avgBurnRate = totalBurnRate / workout.getExercises().size();
            totalCaloriesBurned += (int) (workout.getDurationMinutes() * avgBurnRate);
        }

        Map<String, Integer> muscleGroupStats = getMostTrainedMuscleGroup(user.getId());
        List<WeeklyTrend> weeklyTrends = getWeeklyTrends(workouts);

        return new UserStats(totalWorkouts, totalDurationMinutes, totalCaloriesBurned, muscleGroupStats, weeklyTrends);
    }

    private Map<String, Integer> getMostTrainedMuscleGroup(String userId) {
        Aggregation aggregation = newAggregation(
                match(Criteria.where("userId").is(userId)),
                unwind("exercises"),
                lookup("exercises", "exercises.$id", "_id", "exerciseDetails"),
                unwind("exerciseDetails"),
                group("exerciseDetails.muscleGroup").count().as("count"),
                sort(Sort.Direction.DESC, "count"),
                limit(5));

        AggregationResults<MuscleGroupStat> results = mongoTemplate.aggregate(aggregation, "workouts",
                MuscleGroupStat.class);
        Map<String, Integer> stats = new HashMap<>();
        results.getMappedResults().forEach(stat -> stats.put(stat.getId(), stat.getCount()));
        return stats;
    }

    private List<WeeklyTrend> getWeeklyTrends(List<Workout> workouts) {
        LocalDate now = LocalDate.now();
        LocalDate startOfWeek = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

        Map<DayOfWeek, Integer> dayCounts = new HashMap<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            dayCounts.put(day, 0);
        }

        for (Workout workout : workouts) {
            LocalDate workoutDate = workout.getDate().toLocalDate();
            if (!workoutDate.isBefore(startOfWeek) && !workoutDate.isAfter(now)) {
                DayOfWeek day = workoutDate.getDayOfWeek();
                dayCounts.put(day, dayCounts.get(day) + 1);
            }
        }

        return dayCounts.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new WeeklyTrend(entry.getKey().name().substring(0, 3), entry.getValue()))
                .toList();
    }

    @Data
    @AllArgsConstructor
    public static class UserStats {
        private int totalWorkouts;
        private int totalDurationMinutes;
        private int totalCaloriesBurned;
        private Map<String, Integer> muscleGroupStats;
        private List<WeeklyTrend> weeklyTrends;
    }

    @Data
    public static class MuscleGroupStat {
        @org.springframework.data.annotation.Id
        private String id;
        private int count;
    }

    @Data
    @AllArgsConstructor
    public static class WeeklyTrend {
        private String week; // Keeping name 'week' for frontend compatibility, but it represents Day Name
                             // (Mon, Tue)
        private int count;
    }
}
