package com.fitnesstracker.exercise.repository;

import com.fitnesstracker.exercise.model.Exercise;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ExerciseRepository extends MongoRepository<Exercise, String> {
    List<Exercise> findByMuscleGroup(String muscleGroup);
}
