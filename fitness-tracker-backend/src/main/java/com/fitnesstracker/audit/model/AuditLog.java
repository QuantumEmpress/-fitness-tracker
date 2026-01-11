package com.fitnesstracker.audit.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "audit_logs")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuditLog {
    @Id
    private String id;

    private String adminId;
    private String adminUsername;
    private String action; // BAN_USER, UNBAN_USER, DELETE_USER, PROMOTE_USER, etc.
    private String targetUserId;
    private String targetUsername;
    private String details;
    private LocalDateTime timestamp;

    public AuditLog(String adminId, String adminUsername, String action, String targetUserId, String targetUsername,
            String details) {
        this.adminId = adminId;
        this.adminUsername = adminUsername;
        this.action = action;
        this.targetUserId = targetUserId;
        this.targetUsername = targetUsername;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }
}
