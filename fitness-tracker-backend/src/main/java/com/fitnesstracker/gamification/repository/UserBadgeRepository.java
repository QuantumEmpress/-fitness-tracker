package com.fitnesstracker.gamification.repository;

import com.fitnesstracker.gamification.model.BadgeType;
import com.fitnesstracker.gamification.model.UserBadge;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserBadgeRepository extends MongoRepository<UserBadge, String> {
    List<UserBadge> findByUserId(String userId);

    boolean existsByUserIdAndBadgeType(String userId, BadgeType badgeType);
}
