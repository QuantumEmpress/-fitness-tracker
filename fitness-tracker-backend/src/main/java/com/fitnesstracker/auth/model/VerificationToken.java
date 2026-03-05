package com.fitnesstracker.auth.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "verification_tokens")
public class VerificationToken {

    public enum TokenType {
        EMAIL_VERIFICATION,
        PASSWORD_RESET
    }

    @Id
    private String id;

    @Indexed
    private String token;

    private String userId;
    private String email;
    private TokenType type;
    private LocalDateTime expiresAt;

    public VerificationToken(String token, String userId, String email, TokenType type) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.type = type;
        this.expiresAt = LocalDateTime.now().plusMinutes(15);
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt);
    }
}
