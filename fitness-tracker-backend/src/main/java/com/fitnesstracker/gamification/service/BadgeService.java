package com.fitnesstracker.gamification.service;

import com.fitnesstracker.gamification.model.BadgeType;
import com.fitnesstracker.gamification.model.UserBadge;
import com.fitnesstracker.gamification.repository.UserBadgeRepository;
import com.fitnesstracker.workout.model.Workout;
import com.fitnesstracker.workout.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Service
public class BadgeService {

    @Autowired
    private UserBadgeRepository userBadgeRepository;

    @Autowired
    private WorkoutRepository workoutRepository;

    public List<UserBadge> getUserBadges(String userId) {
        return userBadgeRepository.findByUserId(userId);
    }

    public void checkAndAwardBadges(String userId, Workout newWorkout) {
        List<Workout> allWorkouts = workoutRepository.findByUserId(userId);
        int totalWorkouts = allWorkouts.size();

        // Count Badges
        if (totalWorkouts >= 1)
            awardBadge(userId, BadgeType.FIRST_WORKOUT);
        if (totalWorkouts >= 5)
            awardBadge(userId, BadgeType.WORKOUT_5);
        if (totalWorkouts >= 10)
            awardBadge(userId, BadgeType.WORKOUT_10);
        if (totalWorkouts >= 25)
            awardBadge(userId, BadgeType.WORKOUT_25);
        if (totalWorkouts >= 50)
            awardBadge(userId, BadgeType.WORKOUT_50);

        // Time Badges
        LocalTime time = newWorkout.getDate().toLocalTime();
        if (time.isBefore(LocalTime.of(8, 0)))
            awardBadge(userId, BadgeType.EARLY_BIRD);
        if (time.isAfter(LocalTime.of(20, 0)))
            awardBadge(userId, BadgeType.NIGHT_OWL);

        // Weekend Badge
        DayOfWeek day = newWorkout.getDate().getDayOfWeek();
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY)
            awardBadge(userId, BadgeType.WEEKEND_WARRIOR);
    }

    private void awardBadge(String userId, BadgeType badgeType) {
        if (!userBadgeRepository.existsByUserIdAndBadgeType(userId, badgeType)) {
            UserBadge badge = new UserBadge(userId, badgeType);
            userBadgeRepository.save(badge);
        }
    }
}
