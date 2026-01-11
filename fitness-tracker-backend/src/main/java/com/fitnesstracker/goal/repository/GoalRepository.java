package com.fitnesstracker.goal.repository;

import com.fitnesstracker.goal.model.Goal;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GoalRepository extends MongoRepository<Goal, String> {
    java.util.List<Goal> findByUserId(String userId);
}
