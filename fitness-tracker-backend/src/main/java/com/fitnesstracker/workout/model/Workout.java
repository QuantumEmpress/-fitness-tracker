package com.fitnesstracker.workout.model;

import com.fitnesstracker.exercise.model.Exercise;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "workouts")
public class Workout {
    @Id
    private String id;

    private String userId;

    private String name;

    private LocalDateTime date;

    private int durationMinutes;

    @DBRef
    private List<Exercise> exercises;
}
