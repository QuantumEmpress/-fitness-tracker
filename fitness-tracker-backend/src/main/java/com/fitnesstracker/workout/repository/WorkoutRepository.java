package com.fitnesstracker.workout.repository;

import com.fitnesstracker.workout.model.Workout;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface WorkoutRepository extends MongoRepository<Workout, String> {
    List<Workout> findByUserId(String userId);
}
