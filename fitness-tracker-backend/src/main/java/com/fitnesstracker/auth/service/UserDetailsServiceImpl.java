package com.fitnesstracker.auth.service;

import com.fitnesstracker.auth.model.User;
import com.fitnesstracker.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    com.fitnesstracker.audit.repository.AuditLogRepository auditLogRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElse(null);

        if (user == null) {
            // Check if user was deleted
            if (auditLogRepository.existsByTargetUsernameAndAction(username, "DELETE_USER")) {
                throw new org.springframework.security.authentication.DisabledException(
                        "Your account has been deleted by an administrator.");
            }
            throw new UsernameNotFoundException("User Not Found with username: " + username);
        }

        System.out.println("DEBUG: Loading user: " + user.getUsername() + ", Enabled: " + user.isEnabled()
                + ", EmailVerified: " + user.isEmailVerified());

        if (!user.isEmailVerified()) {
            throw new org.springframework.security.authentication.DisabledException(
                    "Please verify your email before logging in. Check your inbox for a verification link.");
        }

        return UserDetailsImpl.build(user);
    }
}
