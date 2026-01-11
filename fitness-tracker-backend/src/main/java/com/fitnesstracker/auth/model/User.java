package com.fitnesstracker.auth.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @NotBlank
    @Size(max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(max = 120)
    private String password;

    private Set<Role> roles = new HashSet<>();

    private String profilePictureUrl;

    // Physical Stats
    private Double height; // in cm
    private Double weight; // in kg
    private Integer age;
    private String gender; // MALE, FEMALE
    private String activityLevel; // SEDENTARY, LIGHT, MODERATE, ACTIVE, VERY_ACTIVE

    private boolean enabled = true; // Default to true

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
