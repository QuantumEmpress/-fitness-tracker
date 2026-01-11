package com.fitnesstracker.audit.controller;

import com.fitnesstracker.audit.model.AuditLog;
import com.fitnesstracker.audit.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/audit")
@PreAuthorize("hasRole('ADMIN')")
public class AuditLogController {
    @Autowired
    private AuditLogService auditLogService;

    @GetMapping("/logs")
    public ResponseEntity<List<AuditLog>> getAllLogs() {
        return ResponseEntity.ok(auditLogService.getAllLogs());
    }

    @GetMapping("/logs/admin/{adminId}")
    public ResponseEntity<List<AuditLog>> getLogsByAdmin(@PathVariable String adminId) {
        return ResponseEntity.ok(auditLogService.getLogsByAdmin(adminId));
    }

    @GetMapping("/logs/user/{userId}")
    public ResponseEntity<List<AuditLog>> getLogsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(auditLogService.getLogsByTargetUser(userId));
    }

    @DeleteMapping("/logs")
    public ResponseEntity<String> clearAllLogs() {
        auditLogService.clearAllLogs();
        return ResponseEntity.ok("All audit logs cleared successfully");
    }
}
