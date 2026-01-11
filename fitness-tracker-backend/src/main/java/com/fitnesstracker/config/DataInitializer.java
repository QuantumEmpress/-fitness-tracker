package com.fitnesstracker.config;

import com.fitnesstracker.auth.model.Role;
import com.fitnesstracker.auth.model.User;
import com.fitnesstracker.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@fitnesstracker.com");
            admin.setPassword(passwordEncoder.encode("admin123"));

            Set<Role> roles = new HashSet<>();
            roles.add(Role.ROLE_USER);
            roles.add(Role.ROLE_ADMIN);
            admin.setRoles(roles);

            userRepository.save(admin);
            System.out.println("Admin user created: username=admin, password=admin123");
        }
    }
}
