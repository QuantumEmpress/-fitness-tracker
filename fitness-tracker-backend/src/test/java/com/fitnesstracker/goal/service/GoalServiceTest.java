package com.fitnesstracker.goal.service;

import com.fitnesstracker.auth.model.User;
import com.fitnesstracker.auth.repository.UserRepository;
import com.fitnesstracker.config.NotificationService;
import com.fitnesstracker.goal.model.Goal;
import com.fitnesstracker.goal.repository.GoalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GoalServiceTest {

    @Mock
    private GoalRepository goalRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private GoalService goalService;

    private User testUser;
    private Goal testGoal;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId("user123");
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        testGoal = new Goal();
        testGoal.setId("goal123");
        testGoal.setUserId("user123");
        testGoal.setDescription("Run 10km");
        testGoal.setTargetDate(LocalDate.of(2026, 6, 1));
        testGoal.setAchieved(false);
    }

    @Test
    @DisplayName("Should return all goals for a given user")
    void getAllGoals_Success() {
        Goal goal2 = new Goal();
        goal2.setId("goal456");
        goal2.setUserId("user123");
        goal2.setDescription("Lose 5kg");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(goalRepository.findByUserId("user123")).thenReturn(Arrays.asList(testGoal, goal2));

        List<Goal> goals = goalService.getAllGoals("testuser");

        assertEquals(2, goals.size());
        assertEquals("Run 10km", goals.get(0).getDescription());
        verify(userRepository).findByUsername("testuser");
        verify(goalRepository).findByUserId("user123");
    }

    @Test
    @DisplayName("Should throw exception when user not found for getAllGoals")
    void getAllGoals_UserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> goalService.getAllGoals("unknown"));
    }

    @Test
    @DisplayName("Should create a goal and set userId")
    void createGoal_Success() {
        Goal newGoal = new Goal();
        newGoal.setDescription("Bench 100kg");
        newGoal.setTargetDate(LocalDate.of(2026, 12, 31));

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(goalRepository.save(any(Goal.class))).thenAnswer(invocation -> {
            Goal saved = invocation.getArgument(0);
            saved.setId("newGoalId");
            return saved;
        });

        Goal created = goalService.createGoal("testuser", newGoal);

        assertEquals("user123", created.getUserId());
        assertEquals("Bench 100kg", created.getDescription());
        verify(goalRepository).save(newGoal);
    }

    @Test
    @DisplayName("Should update a goal's details")
    void updateGoal_Success() {
        Goal updatedDetails = new Goal();
        updatedDetails.setDescription("Run 15km");
        updatedDetails.setTargetDate(LocalDate.of(2026, 7, 1));
        updatedDetails.setAchieved(false);

        when(goalRepository.findById("goal123")).thenReturn(Optional.of(testGoal));
        when(goalRepository.save(any(Goal.class))).thenReturn(testGoal);

        Goal result = goalService.updateGoal("goal123", updatedDetails);

        assertEquals("Run 15km", result.getDescription());
        assertEquals(LocalDate.of(2026, 7, 1), result.getTargetDate());
        verify(goalRepository).save(testGoal);
    }

    @Test
    @DisplayName("Should notify user when goal is achieved")
    void updateGoal_AchievedNotification() {
        Goal achievedDetails = new Goal();
        achievedDetails.setDescription("Run 10km");
        achievedDetails.setTargetDate(LocalDate.of(2026, 6, 1));
        achievedDetails.setAchieved(true);

        when(goalRepository.findById("goal123")).thenReturn(Optional.of(testGoal));
        when(goalRepository.save(any(Goal.class))).thenReturn(testGoal);

        goalService.updateGoal("goal123", achievedDetails);

        verify(notificationService).notifyUser(eq("user123"), anyString(), anyString());
    }

    @Test
    @DisplayName("Should throw exception when goal not found for update")
    void updateGoal_GoalNotFound() {
        when(goalRepository.findById("nonexistent")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> goalService.updateGoal("nonexistent", new Goal()));
    }

    @Test
    @DisplayName("Should delete a goal by id")
    void deleteGoal_Success() {
        doNothing().when(goalRepository).deleteById("goal123");

        goalService.deleteGoal("goal123");

        verify(goalRepository).deleteById("goal123");
    }
}
