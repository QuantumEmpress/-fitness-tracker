package com.fitnesstracker.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDto {
    private String id;
    private String username;
    private String email;
    private List<String> roles;
    private String profilePictureUrl;
    private Double height;
    private Double weight;
    private Integer age;
    private String gender;
    private String activityLevel;
    private Double bmi;
    private Double bmr;

    private Double tdee; // Total Daily Energy Expenditure
    private boolean enabled;
}
