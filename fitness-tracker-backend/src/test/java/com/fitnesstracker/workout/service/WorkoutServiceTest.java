package com.fitnesstracker.workout.service;

import com.fitnesstracker.auth.model.User;
import com.fitnesstracker.auth.repository.UserRepository;
import com.fitnesstracker.config.NotificationService;
import com.fitnesstracker.exercise.model.Exercise;
import com.fitnesstracker.exercise.repository.ExerciseRepository;
import com.fitnesstracker.gamification.service.BadgeService;
import com.fitnesstracker.workout.dto.WorkoutDto;
import com.fitnesstracker.workout.model.Workout;
import com.fitnesstracker.workout.repository.WorkoutRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkoutServiceTest {

    @Mock
    private WorkoutRepository workoutRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ExerciseRepository exerciseRepository;

    @Mock
    private BadgeService badgeService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private WorkoutService workoutService;

    private User testUser;
    private Workout testWorkout;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId("user123");
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        testWorkout = new Workout();
        testWorkout.setId("workout123");
        testWorkout.setUserId("user123");
        testWorkout.setName("Morning Workout");
        testWorkout.setDurationMinutes(45);
        testWorkout.setDate(LocalDateTime.now());
    }

    @Test
    @DisplayName("Should return all workouts for a user")
    void getUserWorkouts_Success() {
        Workout workout2 = new Workout();
        workout2.setId("workout456");
        workout2.setUserId("user123");
        workout2.setName("Evening Run");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(workoutRepository.findByUserId("user123")).thenReturn(Arrays.asList(testWorkout, workout2));

        List<Workout> workouts = workoutService.getUserWorkouts("testuser");

        assertEquals(2, workouts.size());
        assertEquals("Morning Workout", workouts.get(0).getName());
        verify(workoutRepository).findByUserId("user123");
    }

    @Test
    @DisplayName("Should throw exception when user not found for getUserWorkouts")
    void getUserWorkouts_UserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> workoutService.getUserWorkouts("unknown"));
    }

    @Test
    @DisplayName("Should log a workout and trigger dashboard notification")
    void logWorkout_Success() {
        WorkoutDto workoutDto = new WorkoutDto();
        workoutDto.setName("Chest Day");
        workoutDto.setDurationMinutes(60);
        workoutDto.setDate(LocalDateTime.now());

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(workoutRepository.save(any(Workout.class))).thenAnswer(invocation -> {
            Workout saved = invocation.getArgument(0);
            saved.setId("newWorkoutId");
            return saved;
        });

        Workout result = workoutService.logWorkout("testuser", workoutDto);

        assertEquals("Chest Day", result.getName());
        assertEquals(60, result.getDurationMinutes());
        assertEquals("user123", result.getUserId());
        verify(workoutRepository).save(any(Workout.class));
        verify(badgeService).checkAndAwardBadges(eq("user123"), any(Workout.class));
        verify(notificationService).broadcastDashboardUpdate("user123");
    }

    @Test
    @DisplayName("Should log workout with exercises")
    void logWorkout_WithExercises() {
        Exercise ex1 = new Exercise();
        ex1.setId("ex1");
        ex1.setName("Bench Press");

        WorkoutDto workoutDto = new WorkoutDto();
        workoutDto.setName("Full Body");
        workoutDto.setDurationMinutes(90);
        workoutDto.setExerciseIds(Arrays.asList("ex1"));

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(exerciseRepository.findAllById(Arrays.asList("ex1"))).thenReturn(Arrays.asList(ex1));
        when(workoutRepository.save(any(Workout.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Workout result = workoutService.logWorkout("testuser", workoutDto);

        assertNotNull(result.getExercises());
        assertEquals(1, result.getExercises().size());
        assertEquals("Bench Press", result.getExercises().get(0).getName());
    }

    @Test
    @DisplayName("Should delete a workout owned by the user")
    void deleteWorkout_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(workoutRepository.findById("workout123")).thenReturn(Optional.of(testWorkout));
        doNothing().when(workoutRepository).deleteById("workout123");

        workoutService.deleteWorkout("workout123", "testuser");

        verify(workoutRepository).deleteById("workout123");
        verify(notificationService).broadcastDashboardUpdate("user123");
    }

    @Test
    @DisplayName("Should throw exception when deleting another user's workout")
    void deleteWorkout_Unauthorized() {
        User otherUser = new User();
        otherUser.setId("otherUser");
        otherUser.setUsername("other");

        when(userRepository.findByUsername("other")).thenReturn(Optional.of(otherUser));
        when(workoutRepository.findById("workout123")).thenReturn(Optional.of(testWorkout));

        assertThrows(RuntimeException.class,
                () -> workoutService.deleteWorkout("workout123", "other"));

        verify(workoutRepository, never()).deleteById(anyString());
    }

    @Test
    @DisplayName("Should throw exception when workout not found for deletion")
    void deleteWorkout_NotFound() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(workoutRepository.findById("nonexistent")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> workoutService.deleteWorkout("nonexistent", "testuser"));
    }
}
