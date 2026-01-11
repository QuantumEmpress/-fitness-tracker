package com.fitnesstracker.audit.service;

import com.fitnesstracker.audit.model.AuditLog;
import com.fitnesstracker.audit.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {
    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(String adminId, String adminUsername, String action, String targetUserId,
            String targetUsername, String details) {
        AuditLog log = new AuditLog(adminId, adminUsername, action, targetUserId, targetUsername, details);
        auditLogRepository.save(log);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    public List<AuditLog> getLogsByAdmin(String adminId) {
        return auditLogRepository.findByAdminIdOrderByTimestampDesc(adminId);
    }

    public List<AuditLog> getLogsByTargetUser(String targetUserId) {
        return auditLogRepository.findByTargetUserIdOrderByTimestampDesc(targetUserId);
    }

    public void clearAllLogs() {
        auditLogRepository.deleteAll();
    }
}
