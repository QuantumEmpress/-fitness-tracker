package com.fitnesstracker.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeaderboardEntryDto {
    private String username;
    private String profilePictureUrl;
    private int totalWorkouts;
    private int totalDurationMinutes;
}
