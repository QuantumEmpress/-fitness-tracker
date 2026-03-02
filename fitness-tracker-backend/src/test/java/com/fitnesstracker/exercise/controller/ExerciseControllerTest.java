package com.fitnesstracker.exercise.controller;

import com.fitnesstracker.exercise.model.Exercise;
import com.fitnesstracker.exercise.service.ExerciseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ExerciseControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ExerciseService exerciseService;

    @InjectMocks
    private ExerciseController exerciseController;

    private Exercise testExercise;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(exerciseController).build();

        testExercise = new Exercise();
        testExercise.setId("ex123");
        testExercise.setName("Bench Press");
        testExercise.setDescription("Flat bench press for chest");
        testExercise.setMuscleGroup("Chest");
        testExercise.setIntensity("HIGH");
    }

    @Test
    @DisplayName("GET /api/exercises - Should return all exercises")
    void getAllExercises_Success() throws Exception {
        Exercise ex2 = new Exercise();
        ex2.setId("ex456");
        ex2.setName("Squat");

        when(exerciseService.getAllExercises()).thenReturn(Arrays.asList(testExercise, ex2));

        mockMvc.perform(get("/api/exercises"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Bench Press"));
    }

    @Test
    @DisplayName("GET /api/exercises/{id} - Should return exercise by ID")
    void getExerciseById_Success() throws Exception {
        when(exerciseService.getExerciseById("ex123")).thenReturn(Optional.of(testExercise));

        mockMvc.perform(get("/api/exercises/ex123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Bench Press"))
                .andExpect(jsonPath("$.muscleGroup").value("Chest"));
    }

    @Test
    @DisplayName("GET /api/exercises/{id} - Should return 404 for non-existent exercise")
    void getExerciseById_NotFound() throws Exception {
        when(exerciseService.getExerciseById("nonexistent")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/exercises/nonexistent"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/exercises/{id} - Should delete an exercise")
    void deleteExercise_Success() throws Exception {
        mockMvc.perform(delete("/api/exercises/ex123"))
                .andExpect(status().isNoContent());

        verify(exerciseService).deleteExercise("ex123");
    }
}
