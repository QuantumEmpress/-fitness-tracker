package com.fitnesstracker.goal.service;

import com.fitnesstracker.auth.model.User;
import com.fitnesstracker.auth.repository.UserRepository;
import com.fitnesstracker.config.NotificationService;
import com.fitnesstracker.goal.model.Goal;
import com.fitnesstracker.goal.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GoalService {
    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public java.util.List<Goal> getAllGoals(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
        return goalRepository.findByUserId(user.getId());
    }

    public Goal createGoal(String username, Goal goal) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
        goal.setUserId(user.getId());
        return goalRepository.save(goal);
    }

    public Goal updateGoal(String id, Goal goalDetails) {
        Goal goal = goalRepository.findById(id).orElseThrow(() -> new RuntimeException("Goal not found"));
        goal.setDescription(goalDetails.getDescription());
        goal.setTargetDate(goalDetails.getTargetDate());
        goal.setAchieved(goalDetails.isAchieved());

        Goal saved = goalRepository.save(goal);

        // Notify user when goal is marked as achieved
        if (goalDetails.isAchieved() && !goal.isNotified()) {
            notificationService.notifyUser(
                    goal.getUserId(),
                    "🎯 Goal Achieved!",
                    "Congratulations! You completed: \"" + goal.getDescription() + "\"");
        }

        return saved;
    }

    public void deleteGoal(String id) {
        goalRepository.deleteById(id);
    }
}
