package com.fitnesstracker.user.service;

import com.fitnesstracker.auth.model.User;
import com.fitnesstracker.auth.repository.UserRepository;
import com.fitnesstracker.user.dto.UserProfileDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.fitnesstracker.service.CloudinaryService cloudinaryService;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private com.fitnesstracker.audit.service.AuditLogService auditLogService;

    public UserProfileDto getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        return mapToDto(user);
    }

    public UserProfileDto updateUserProfile(String username, UserProfileDto profileDto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        if (profileDto.getUsername() != null)
            user.setUsername(profileDto.getUsername());
        if (profileDto.getEmail() != null)
            user.setEmail(profileDto.getEmail());
        if (profileDto.getHeight() != null)
            user.setHeight(profileDto.getHeight());
        if (profileDto.getWeight() != null)
            user.setWeight(profileDto.getWeight());
        if (profileDto.getAge() != null)
            user.setAge(profileDto.getAge());
        if (profileDto.getGender() != null)
            user.setGender(profileDto.getGender());
        if (profileDto.getActivityLevel() != null)
            user.setActivityLevel(profileDto.getActivityLevel());

        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    private UserProfileDto mapToDto(User user) {
        Double bmi = calculateBMI(user.getHeight(), user.getWeight());
        Double bmr = calculateBMR(user.getHeight(), user.getWeight(), user.getAge(), user.getGender());
        Double tdee = calculateTDEE(bmr, user.getActivityLevel());

        return new UserProfileDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRoles().stream().map(role -> role.name()).collect(Collectors.toList()),
                user.getProfilePictureUrl(),
                user.getHeight(),
                user.getWeight(),
                user.getAge(),
                user.getGender(),
                user.getActivityLevel(),
                bmi,
                bmr,
                tdee,
                user.isEnabled());
    }

    public void banUser(String id, String adminId, String adminUsername) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with id: " + id));
        user.setEnabled(false);
        userRepository.save(user);
        auditLogService.logAction(adminId, adminUsername, "BAN_USER", user.getId(), user.getUsername(),
                "User account banned");
    }

    public void unbanUser(String id, String adminId, String adminUsername) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with id: " + id));
        user.setEnabled(true);
        userRepository.save(user);
        auditLogService.logAction(adminId, adminUsername, "UNBAN_USER", user.getId(), user.getUsername(),
                "User account unbanned");
    }

    private Double calculateBMI(Double height, Double weight) {
        if (height == null || weight == null || height == 0)
            return null;
        return weight / ((height / 100) * (height / 100));
    }

    private Double calculateBMR(Double height, Double weight, Integer age, String gender) {
        if (height == null || weight == null || age == null || gender == null)
            return null;
        // Mifflin-St Jeor Equation
        double s = gender.equalsIgnoreCase("MALE") ? 5 : -161;
        return (10 * weight) + (6.25 * height) + (5 * age) + s;
    }

    private Double calculateTDEE(Double bmr, String activityLevel) {
        if (bmr == null || activityLevel == null)
            return null;
        double multiplier = switch (activityLevel.toUpperCase()) {
            case "SEDENTARY" -> 1.2;
            case "LIGHT" -> 1.375;
            case "MODERATE" -> 1.55;
            case "ACTIVE" -> 1.725;
            case "VERY_ACTIVE" -> 1.9;
            default -> 1.2;
        };
        return bmr * multiplier;
    }

    public List<UserProfileDto> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public void deleteUser(String id, String adminId, String adminUsername) {
        userRepository.findById(id).ifPresentOrElse(user -> {
            String username = user.getUsername();
            userRepository.deleteById(id);
            auditLogService.logAction(adminId, adminUsername, "DELETE_USER", id, username, "User account deleted");
        }, () -> {
            // User not found, implicitly deleted. Log if necessary, but do not throw
            // exception.
            // This allows the frontend to proceed with removing the item from the list.
        });
    }

    public void updateUserRole(String id, java.util.Set<com.fitnesstracker.auth.model.Role> roles, String adminId,
            String adminUsername) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with id: " + id));
        user.setRoles(roles);
        userRepository.save(user);
        auditLogService.logAction(adminId, adminUsername, "PROMOTE_USER", user.getId(), user.getUsername(),
                "User promoted to: " + roles.toString());
    }

    public String uploadProfilePicture(String username, org.springframework.web.multipart.MultipartFile file)
            throws java.io.IOException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        String imageUrl = cloudinaryService.uploadImage(file);
        user.setProfilePictureUrl(imageUrl);
        userRepository.save(user);
        return imageUrl;
    }

    public void changePassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Encode and set new password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
