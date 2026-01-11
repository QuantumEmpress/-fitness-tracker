package com.fitnesstracker.gamification.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_badges")
public class UserBadge {
    @Id
    private String id;

    private String userId;

    private BadgeType badgeType;

    private LocalDateTime earnedAt;

    public UserBadge(String userId, BadgeType badgeType) {
        this.userId = userId;
        this.badgeType = badgeType;
        this.earnedAt = LocalDateTime.now();
    }
}
