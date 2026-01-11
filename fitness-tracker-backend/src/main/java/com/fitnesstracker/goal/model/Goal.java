package com.fitnesstracker.goal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "goals")
public class Goal {
    @Id
    private String id;

    @NotNull
    private String userId;

    private String description;

    private java.time.LocalDate targetDate;

    private boolean achieved;
}
