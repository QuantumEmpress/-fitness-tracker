package com.fitnesstracker.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

        private static final String BEARER_SCHEME = "bearerAuth";

        @Bean
        public OpenAPI fitnessTrackerOpenAPI() {
                return new OpenAPI()
                                .info(new Info()
                                                .title("FitTrack Pro - Fitness Tracker API")
                                                .description("""
                                                                REST API for the **FitTrack Pro** Fitness Tracker Application.

                                                                ### Authentication
                                                                1. Call `POST /api/auth/signup` to create an account (a verification email is sent).
                                                                2. Click the link in the email to verify your address.
                                                                3. Call `POST /api/auth/signin` to receive a JWT token.
                                                                4. Click the **Authorize 🔒** button above and paste your token to access protected endpoints.

                                                                ### Features
                                                                - Workout & exercise tracking
                                                                - Goal management with deadline reminders
                                                                - Progress photos & calculators
                                                                - Gamification & leaderboard
                                                                - Admin management & audit logs
                                                                - Real-time WebSocket dashboard updates
                                                                """)
                                                .version("v2.0")
                                                .contact(new Contact()
                                                                .name("Okafor Omalicha")
                                                                .email("okaforomalicha98@gmail.com")))
                                // JWT Bearer security scheme — adds the 🔒 Authorize button to Swagger UI
                                .addSecurityItem(new SecurityRequirement().addList(BEARER_SCHEME))
                                .components(new Components()
                                                .addSecuritySchemes(BEARER_SCHEME, new SecurityScheme()
                                                                .name(BEARER_SCHEME)
                                                                .type(SecurityScheme.Type.HTTP)
                                                                .scheme("bearer")
                                                                .bearerFormat("JWT")
                                                                .description("Paste your JWT token here (without the 'Bearer ' prefix).")));
        }
}
