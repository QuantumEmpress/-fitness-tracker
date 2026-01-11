package com.fitnesstracker.dashboard.service;

import com.fitnesstracker.auth.model.User;
import com.fitnesstracker.auth.repository.UserRepository;
import com.fitnesstracker.dashboard.dto.LeaderboardEntryDto;
import com.fitnesstracker.workout.model.Workout;
import com.fitnesstracker.workout.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkoutRepository workoutRepository;

    public List<LeaderboardEntryDto> getLeaderboard() {
        List<User> users = userRepository.findAll();
        List<LeaderboardEntryDto> leaderboard = new ArrayList<>();

        for (User user : users) {
            List<Workout> userWorkouts = workoutRepository.findByUserId(user.getId());
            int totalWorkouts = userWorkouts.size();
            int totalDuration = userWorkouts.stream().mapToInt(Workout::getDurationMinutes).sum();

            if (totalWorkouts > 0) {
                leaderboard.add(new LeaderboardEntryDto(
                        user.getUsername(),
                        user.getProfilePictureUrl(),
                        totalWorkouts,
                        totalDuration));
            }
        }

        // Sort by total duration descending
        return leaderboard.stream()
                .sorted((a, b) -> b.getTotalDurationMinutes() - a.getTotalDurationMinutes())
                .limit(10) // Top 10
                .collect(Collectors.toList());
    }
}
