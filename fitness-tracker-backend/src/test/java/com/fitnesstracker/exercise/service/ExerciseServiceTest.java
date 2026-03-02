package com.fitnesstracker.exercise.service;

import com.fitnesstracker.config.NotificationService;
import com.fitnesstracker.exercise.model.Exercise;
import com.fitnesstracker.exercise.repository.ExerciseRepository;
import com.fitnesstracker.service.CloudinaryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExerciseServiceTest {

    @Mock
    private ExerciseRepository exerciseRepository;

    @Mock
    private CloudinaryService cloudinaryService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ExerciseService exerciseService;

    private Exercise testExercise;

    @BeforeEach
    void setUp() {
        testExercise = new Exercise();
        testExercise.setId("ex123");
        testExercise.setName("Bench Press");
        testExercise.setDescription("Flat bench press for chest");
        testExercise.setMuscleGroup("Chest");
        testExercise.setIntensity("HIGH");
    }

    @Test
    @DisplayName("Should return all exercises")
    void getAllExercises_Success() {
        Exercise ex2 = new Exercise();
        ex2.setId("ex456");
        ex2.setName("Squat");
        ex2.setMuscleGroup("Legs");

        when(exerciseRepository.findAll()).thenReturn(Arrays.asList(testExercise, ex2));

        List<Exercise> exercises = exerciseService.getAllExercises();

        assertEquals(2, exercises.size());
        assertEquals("Bench Press", exercises.get(0).getName());
        verify(exerciseRepository).findAll();
    }

    @Test
    @DisplayName("Should return exercise by ID")
    void getExerciseById_Success() {
        when(exerciseRepository.findById("ex123")).thenReturn(Optional.of(testExercise));

        Optional<Exercise> result = exerciseService.getExerciseById("ex123");

        assertTrue(result.isPresent());
        assertEquals("Bench Press", result.get().getName());
    }

    @Test
    @DisplayName("Should return empty when exercise not found")
    void getExerciseById_NotFound() {
        when(exerciseRepository.findById("nonexistent")).thenReturn(Optional.empty());

        Optional<Exercise> result = exerciseService.getExerciseById("nonexistent");

        assertFalse(result.isPresent());
    }

    @Test
    @DisplayName("Should create exercise without video and broadcast notification")
    void createExercise_WithoutVideo() throws IOException {
        when(exerciseRepository.save(any(Exercise.class))).thenReturn(testExercise);

        Exercise result = exerciseService.createExercise(testExercise, null);

        assertEquals("Bench Press", result.getName());
        verify(exerciseRepository).save(testExercise);
        verify(notificationService).broadcastExerciseUpdate(eq("CREATED"), any(Exercise.class));
        verify(cloudinaryService, never()).uploadVideo(any());
    }

    @Test
    @DisplayName("Should create exercise with video upload")
    void createExercise_WithVideo() throws IOException {
        MultipartFile mockVideo = mock(MultipartFile.class);
        when(mockVideo.isEmpty()).thenReturn(false);
        when(cloudinaryService.uploadVideo(mockVideo)).thenReturn("https://cdn.example.com/video.mp4");
        when(exerciseRepository.save(any(Exercise.class))).thenReturn(testExercise);

        Exercise result = exerciseService.createExercise(testExercise, mockVideo);

        assertNotNull(result);
        verify(cloudinaryService).uploadVideo(mockVideo);
        verify(notificationService).broadcastExerciseUpdate(eq("CREATED"), any());
    }

    @Test
    @DisplayName("Should update exercise and broadcast notification")
    void updateExercise_Success() throws IOException {
        Exercise updatedDetails = new Exercise();
        updatedDetails.setName("Incline Bench Press");
        updatedDetails.setDescription("Incline bench for upper chest");
        updatedDetails.setMuscleGroup("Upper Chest");

        when(exerciseRepository.findById("ex123")).thenReturn(Optional.of(testExercise));
        when(exerciseRepository.save(any(Exercise.class))).thenReturn(testExercise);

        Exercise result = exerciseService.updateExercise("ex123", updatedDetails, null);

        assertEquals("Incline Bench Press", result.getName());
        verify(notificationService).broadcastExerciseUpdate(eq("UPDATED"), any());
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent exercise")
    void updateExercise_NotFound() {
        when(exerciseRepository.findById("nonexistent")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> exerciseService.updateExercise("nonexistent", new Exercise(), null));
    }

    @Test
    @DisplayName("Should delete exercise and broadcast notification")
    void deleteExercise_Success() {
        doNothing().when(exerciseRepository).deleteById("ex123");

        exerciseService.deleteExercise("ex123");

        verify(exerciseRepository).deleteById("ex123");
        verify(notificationService).broadcastExerciseUpdate(eq("DELETED"), eq("ex123"));
    }
}
