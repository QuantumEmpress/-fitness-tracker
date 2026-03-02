package com.fitnesstracker.goal.controller;

import com.fitnesstracker.goal.model.Goal;
import com.fitnesstracker.goal.service.GoalService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class GoalControllerTest {

    private MockMvc mockMvc;

    @Mock
    private GoalService goalService;

    @InjectMocks
    private GoalController goalController;

    private ObjectMapper objectMapper;
    private Goal testGoal;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(goalController).build();

        // Set up a mock authentication so
        // SecurityContextHolder.getContext().getAuthentication() works
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken("testuser", null,
                Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(auth);

        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        testGoal = new Goal();
        testGoal.setId("goal123");
        testGoal.setUserId("user123");
        testGoal.setDescription("Run 10km");
        testGoal.setTargetDate(LocalDate.of(2026, 6, 1));
        testGoal.setAchieved(false);
    }

    @Test
    @DisplayName("POST /api/goals - Should create a new goal")
    void createGoal_Success() throws Exception {
        when(goalService.createGoal(any(), any(Goal.class))).thenReturn(testGoal);

        mockMvc.perform(post("/api/goals")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testGoal)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Run 10km"));
    }

    @Test
    @DisplayName("PUT /api/goals/{id} - Should update a goal")
    void updateGoal_Success() throws Exception {
        Goal updated = new Goal();
        updated.setDescription("Run 15km");
        updated.setTargetDate(LocalDate.of(2026, 7, 1));
        updated.setAchieved(false);

        when(goalService.updateGoal(eq("goal123"), any(Goal.class))).thenReturn(updated);

        mockMvc.perform(put("/api/goals/goal123")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Run 15km"));
    }

    @Test
    @DisplayName("DELETE /api/goals/{id} - Should delete a goal")
    void deleteGoal_Success() throws Exception {
        mockMvc.perform(delete("/api/goals/goal123"))
                .andExpect(status().isNoContent());

        verify(goalService).deleteGoal("goal123");
    }
}
