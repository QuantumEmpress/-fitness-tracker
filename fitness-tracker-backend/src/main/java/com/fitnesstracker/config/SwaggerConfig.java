package com.fitnesstracker.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI fitnessTrackerOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("FitTrack Pro - Fitness Tracker API")
                        .description("REST API for the FitTrack Pro Fitness Tracker Application. " +
                                "Manage workouts, goals, progress photos, badges and user profiles.")
                        .version("v1.0")
                        .contact(new Contact()
                                .name("Okafor Omalicha")
                                .email("prexcy99@gmail.com")));
    }
}
