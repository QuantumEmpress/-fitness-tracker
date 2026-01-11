package com.fitnesstracker.exercise.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "exercises")
public class Exercise {
    @Id
    private String id;

    @NotBlank
    private String name;

    private String description;

    private String videoUrl;

    private String muscleGroup;

    private String intensity; // LOW, MEDIUM, HIGH
}
