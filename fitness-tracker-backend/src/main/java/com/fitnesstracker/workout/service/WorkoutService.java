package com.fitnesstracker.workout.service;

import com.fitnesstracker.auth.model.User;
import com.fitnesstracker.auth.repository.UserRepository;
import com.fitnesstracker.workout.model.Workout;
import com.fitnesstracker.workout.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkoutService {
    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Workout> getUserWorkouts(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
        return workoutRepository.findByUserId(user.getId());
    }

    @Autowired
    private com.fitnesstracker.exercise.repository.ExerciseRepository exerciseRepository;

    @Autowired
    private com.fitnesstracker.gamification.service.BadgeService badgeService;

    public Workout logWorkout(String username, com.fitnesstracker.workout.dto.WorkoutDto workoutDto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        Workout workout = new Workout();
        workout.setUserId(user.getId());
        workout.setName(workoutDto.getName());
        workout.setDurationMinutes(workoutDto.getDurationMinutes());

        if (workoutDto.getDate() == null) {
            workout.setDate(LocalDateTime.now());
        } else {
            workout.setDate(workoutDto.getDate());
        }

        if (workoutDto.getExerciseIds() != null && !workoutDto.getExerciseIds().isEmpty()) {
            List<com.fitnesstracker.exercise.model.Exercise> exercises = exerciseRepository
                    .findAllById(workoutDto.getExerciseIds());
            workout.setExercises(exercises);
        }

        Workout savedWorkout = workoutRepository.save(workout);

        // Check for badges
        badgeService.checkAndAwardBadges(user.getId(), savedWorkout);

        return savedWorkout;
    }

    public void deleteWorkout(String id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout not found"));

        // Verify the workout belongs to the user
        if (!workout.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this workout");
        }

        workoutRepository.deleteById(id);
    }
}
