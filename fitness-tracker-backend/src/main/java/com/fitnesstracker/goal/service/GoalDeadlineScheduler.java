package com.fitnesstracker.goal.service;

import com.fitnesstracker.config.NotificationService;
import com.fitnesstracker.goal.model.Goal;
import com.fitnesstracker.goal.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class GoalDeadlineScheduler {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Runs every 60 seconds. Finds goals whose deadline has passed
     * and sends a notification to each user.
     */
    @Scheduled(fixedRate = 60000)
    public void checkGoalDeadlines() {
        LocalDate today = LocalDate.now();
        List<Goal> dueGoals = goalRepository
                .findByTargetDateLessThanEqualAndAchievedFalseAndNotifiedFalse(today);

        for (Goal goal : dueGoals) {
            notificationService.notifyUser(
                    goal.getUserId(),
                    "⏰ Goal Deadline Reached!",
                    "Your goal \"" + goal.getDescription() + "\" has reached its deadline. Keep pushing!");

            // Mark as notified so we don't send again
            goal.setNotified(true);
            goalRepository.save(goal);
        }
    }
}
