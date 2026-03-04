package com.fitnesstracker.auth.repository;

import com.fitnesstracker.auth.model.VerificationToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface VerificationTokenRepository extends MongoRepository<VerificationToken, String> {
    Optional<VerificationToken> findByToken(String token);

    void deleteByUserId(String userId);

    void deleteByUserIdAndType(String userId, VerificationToken.TokenType type);
}
