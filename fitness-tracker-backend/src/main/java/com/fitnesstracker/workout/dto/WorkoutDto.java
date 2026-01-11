package com.fitnesstracker.workout.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class WorkoutDto {
    private String name;
    private LocalDateTime date;
    private int durationMinutes;
    private List<String> exerciseIds;
}
