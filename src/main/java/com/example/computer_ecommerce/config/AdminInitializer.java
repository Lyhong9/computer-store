package com.example.computer_ecommerce.config;

import com.example.computer_ecommerce.common.enums.Role;
import com.example.computer_ecommerce.user.entity.AppUser;
import com.example.computer_ecommerce.user.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
@ConditionalOnProperty(
        prefix = "app.admin",
        name = "enabled",
        havingValue = "true")
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(
            AppUserRepository users,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.username:}") String username,
            @Value("${app.admin.password:}") String password,
            @Value("${app.admin.email:}") String email) {

        return args -> {
            if (username.isBlank() || password.isBlank() || email.isBlank()) {
                throw new IllegalStateException(
                        "ADMIN_USERNAME, ADMIN_PASSWORD and ADMIN_EMAIL are required when ADMIN_ENABLED=true");
            }

            if (!users.existsByUsername(username)) {
                users.save(new AppUser(
                        username,
                        passwordEncoder.encode(password),
                        email,
                        Set.of(Role.ADMIN)));
            }
        };
    }
}
