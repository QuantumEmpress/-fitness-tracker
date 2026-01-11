package com.fitnesstracker.admin.controller;

import com.fitnesstracker.admin.service.AdminService;
import com.fitnesstracker.auth.model.Role;
import com.fitnesstracker.auth.service.UserDetailsImpl;
import com.fitnesstracker.user.dto.UserProfileDto;
import com.fitnesstracker.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserProfileDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        userService.deleteUser(id, userDetails.getId(), userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<Void> promoteUser(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Set<Role> roles = new HashSet<>();
        roles.add(Role.ROLE_USER);
        roles.add(Role.ROLE_ADMIN);
        userService.updateUserRole(id, roles, userDetails.getId(), userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminService.SystemStats> getSystemStats() {
        return ResponseEntity.ok(adminService.getSystemStats());
    }

    @PutMapping("/users/{id}/ban")
    public ResponseEntity<Void> banUser(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        userService.banUser(id, userDetails.getId(), userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{id}/unban")
    public ResponseEntity<Void> unbanUser(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        userService.unbanUser(id, userDetails.getId(), userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
}
