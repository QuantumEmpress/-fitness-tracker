package com.fitnesstracker.auth.controller;

import com.fitnesstracker.audit.service.AuditLogService;
import com.fitnesstracker.auth.dto.JwtResponse;
import com.fitnesstracker.auth.dto.LoginRequest;
import com.fitnesstracker.auth.dto.MessageResponse;
import com.fitnesstracker.auth.dto.SignupRequest;
import com.fitnesstracker.auth.model.Role;
import com.fitnesstracker.auth.model.User;
import com.fitnesstracker.auth.model.VerificationToken;
import com.fitnesstracker.auth.repository.UserRepository;
import com.fitnesstracker.auth.repository.VerificationTokenRepository;
import com.fitnesstracker.auth.security.JwtUtils;
import com.fitnesstracker.auth.service.EmailService;
import com.fitnesstracker.auth.service.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@Tag(name = "Authentication", description = "User registration, login, email verification and password reset")
@SecurityRequirements
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    VerificationTokenRepository tokenRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    AuditLogService auditLogService;

    @Autowired
    EmailService emailService;

    // ─── SIGN IN ────────────────────────────────────────────────────────────────

    @Operation(summary = "Sign in", description = "Authenticate with username and password. Returns a JWT token on success. Only works if email has been verified.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Authenticated — returns JWT token and user info"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials or email not verified")
    })
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    // ─── SIGN UP ────────────────────────────────────────────────────────────────

    @Operation(summary = "Register a new user", description = "Creates a new user account and sends an email verification link. The user cannot log in until they verify their email.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Account created — verification email sent"),
            @ApiResponse(responseCode = "400", description = "Username or email already taken")
    })
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            roles.add(Role.ROLE_USER);
        } else {
            strRoles.forEach(role -> {
                if ("admin".equals(role)) {
                    roles.add(Role.ROLE_ADMIN);
                } else {
                    roles.add(Role.ROLE_USER);
                }
            });
        }

        user.setRoles(roles);
        user.setEmailVerified(false); // must verify before logging in
        User savedUser = userRepository.save(user);

        // Generate email verification token
        String tokenValue = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(
                tokenValue, savedUser.getId(), savedUser.getEmail(),
                VerificationToken.TokenType.EMAIL_VERIFICATION);
        tokenRepository.save(verificationToken);

        // Send verification email (async)
        emailService.sendVerificationEmail(savedUser.getEmail(), savedUser.getUsername(), tokenValue);

        // Audit log
        auditLogService.logAction(
                savedUser.getId(), savedUser.getUsername(),
                "REGISTER_USER", savedUser.getId(), savedUser.getUsername(),
                "New user account created — email verification pending");

        return ResponseEntity.ok(new MessageResponse(
                "User registered successfully! Please check your email to verify your account."));
    }

    // ─── VERIFY EMAIL ───────────────────────────────────────────────────────────

    @Operation(summary = "Verify email address", description = "Confirms a user's email using the token from the verification link sent on signup. The token expires after 24 hours.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Email verified — user can now log in"),
            @ApiResponse(responseCode = "400", description = "Token is invalid, expired, or already used")
    })
    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam("token") String token) {
        Optional<VerificationToken> optToken = tokenRepository.findByToken(token);

        if (optToken.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid or already used verification link."));
        }

        VerificationToken verificationToken = optToken.get();

        if (verificationToken.isExpired()) {
            tokenRepository.delete(verificationToken);
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Verification link has expired. Please sign up again."));
        }

        if (verificationToken.getType() != VerificationToken.TokenType.EMAIL_VERIFICATION) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid token type."));
        }

        Optional<User> optUser = userRepository.findById(verificationToken.getUserId());
        if (optUser.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: User not found."));
        }

        User user = optUser.get();
        user.setEmailVerified(true);
        userRepository.save(user);
        tokenRepository.delete(verificationToken);

        return ResponseEntity.ok(new MessageResponse("Email verified successfully! You can now log in."));
    }

    // ─── FORGOT PASSWORD ────────────────────────────────────────────────────────

    @Operation(summary = "Request password reset", description = "Sends a password reset link to the provided email address. Always returns 200 to prevent email enumeration attacks.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reset email sent (or silently ignored if email not found)")
    })
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is required."));
        }

        Optional<User> optUser = userRepository.findByEmail(email);
        // Always return the same message to prevent email enumeration attacks
        if (optUser.isEmpty()) {
            return ResponseEntity.ok(new MessageResponse(
                    "If an account with that email exists, a reset link has been sent."));
        }

        User user = optUser.get();

        // Delete any existing password-reset tokens for this user
        tokenRepository.deleteByUserIdAndType(user.getId(), VerificationToken.TokenType.PASSWORD_RESET);

        // Create new reset token
        String tokenValue = UUID.randomUUID().toString();
        VerificationToken resetToken = new VerificationToken(
                tokenValue, user.getId(), user.getEmail(),
                VerificationToken.TokenType.PASSWORD_RESET);
        tokenRepository.save(resetToken);

        // Send reset email (async)
        emailService.sendPasswordResetEmail(user.getEmail(), user.getUsername(), tokenValue);

        return ResponseEntity.ok(new MessageResponse(
                "If an account with that email exists, a reset link has been sent."));
    }

    // ─── RESET PASSWORD ─────────────────────────────────────────────────────────

    @Operation(summary = "Reset password", description = "Sets a new password using the token from the reset email. Token expires after 24 hours and can only be used once.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password updated — user can now log in"),
            @ApiResponse(responseCode = "400", description = "Token invalid, expired, or password too short")
    })
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");

        if (token == null || newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid request. Password must be at least 6 characters."));
        }

        Optional<VerificationToken> optToken = tokenRepository.findByToken(token);
        if (optToken.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid or expired reset link."));
        }

        VerificationToken resetToken = optToken.get();

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Reset link has expired. Please request a new one."));
        }

        if (resetToken.getType() != VerificationToken.TokenType.PASSWORD_RESET) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid token type."));
        }

        Optional<User> optUser = userRepository.findById(resetToken.getUserId());
        if (optUser.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: User not found."));
        }

        User user = optUser.get();
        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);
        tokenRepository.delete(resetToken);

        return ResponseEntity.ok(new MessageResponse("Password reset successfully! You can now log in."));
    }
}
