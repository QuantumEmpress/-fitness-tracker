package com.fitnesstracker.user.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "progress_photos")
public class ProgressPhoto {
    @Id
    private String id;

    private String userId;

    private String photoUrl;

    private LocalDate date;

    private String notes; // Optional notes like "Feeling strong today"

    private Double weight; // Optional weight at the time of photo
}
