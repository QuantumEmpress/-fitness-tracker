package com.fitnesstracker.exercise.service;

import com.fitnesstracker.exercise.model.Exercise;
import com.fitnesstracker.exercise.repository.ExerciseRepository;
import com.fitnesstracker.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ExerciseService {
    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    public List<Exercise> getAllExercises() {
        return exerciseRepository.findAll();
    }

    public Optional<Exercise> getExerciseById(String id) {
        return exerciseRepository.findById(id);
    }

    public Exercise createExercise(Exercise exercise, MultipartFile videoFile) throws IOException {
        if (videoFile != null && !videoFile.isEmpty()) {
            String videoUrl = cloudinaryService.uploadVideo(videoFile);
            exercise.setVideoUrl(videoUrl);
        }
        return exerciseRepository.save(exercise);
    }

    public Exercise updateExercise(String id, Exercise exerciseDetails, MultipartFile videoFile) throws IOException {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found with id: " + id));

        exercise.setName(exerciseDetails.getName());
        exercise.setDescription(exerciseDetails.getDescription());
        exercise.setMuscleGroup(exerciseDetails.getMuscleGroup());

        if (videoFile != null && !videoFile.isEmpty()) {
            String videoUrl = cloudinaryService.uploadVideo(videoFile);
            exercise.setVideoUrl(videoUrl);
        } else if (exerciseDetails.getVideoUrl() != null) {
             exercise.setVideoUrl(exerciseDetails.getVideoUrl());
        }

        return exerciseRepository.save(exercise);
    }

    public void deleteExercise(String id) {
        exerciseRepository.deleteById(id);
    }
}
