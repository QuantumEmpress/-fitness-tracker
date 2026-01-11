package com.fitnesstracker.audit.repository;

import com.fitnesstracker.audit.model.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AuditLogRepository extends MongoRepository<AuditLog, String> {
    List<AuditLog> findAllByOrderByTimestampDesc();

    List<AuditLog> findByAdminIdOrderByTimestampDesc(String adminId);

    List<AuditLog> findByTargetUserIdOrderByTimestampDesc(String targetUserId);
}
