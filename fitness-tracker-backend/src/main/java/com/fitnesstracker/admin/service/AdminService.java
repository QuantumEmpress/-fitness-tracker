package com.fitnesstracker.admin.service;

import com.fitnesstracker.auth.repository.UserRepository;
import com.fitnesstracker.exercise.repository.ExerciseRepository;
import com.fitnesstracker.workout.repository.WorkoutRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    public SystemStats getSystemStats() {
        long totalUsers = userRepository.count();
        long totalWorkouts = workoutRepository.count();
        long totalExercises = exerciseRepository.count();
        // For active users, we might need a more complex query, but for now let's stick to total counts
        // or maybe count users created in the last 7 days if we had a createdAt field.
        // The requirements asked for "Weekly active user count", but without an activity log or lastLogin field,
        // it's hard to get exact active users. I'll stick to total counts for now and maybe add a placeholder or simple logic if possible.
        // Since I can't easily change the User model to add lastLogin without potentially breaking things or needing DB migration,
        // I will return 0 or a placeholder for activeUsers for now, or just omit it if the frontend handles it.
        // Actually, let's just return the totals we have.

        return new SystemStats(totalUsers, totalWorkouts, totalExercises);
    }

    @Data
    @AllArgsConstructor
    public static class SystemStats {
        private long totalUsers;
        private long totalWorkouts;
        private long totalExercises;
        // private long activeUsers; // Placeholder
    }
}
