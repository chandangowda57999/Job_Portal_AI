package com.jobportal.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobportal.jobportal.customexceptionhandler.UserNotFoundException;
import com.jobportal.jobportal.dto.AuthResponse;
import com.jobportal.jobportal.dto.LoginRequest;
import com.jobportal.jobportal.dto.RegisterRequest;
import com.jobportal.jobportal.dto.UserDTO;
import com.jobportal.jobportal.entity.User;
import com.jobportal.jobportal.mapper.UserMapper;
import com.jobportal.jobportal.repo.UserRepo;

import java.util.UUID;

/**
 * Service class for handling authentication operations.
 * Manages user registration, login, and password hashing.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@Service
@Transactional
public class AuthService {

    private final UserRepo userRepo;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    /**
     * Constructor for AuthService.
     * 
     * @param userRepo Repository for user database operations
     * @param userMapper MapStruct mapper for User conversions
     * @param passwordEncoder BCrypt password encoder for hashing passwords
     */
    @Autowired
    public AuthService(UserRepo userRepo, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registers a new user with email and password.
     * Hashes the password before storing in database.
     * 
     * @param request Registration request containing name, email, and password
     * @return AuthResponse containing token and user information
     * @throws IllegalArgumentException if email already exists
     */
    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered. Please sign in instead.");
        }

        // Split name into firstName and lastName
        String[] nameParts = splitName(request.getName());
        String firstName = nameParts[0];
        // If only one name part, use it as lastName too to satisfy database constraint (nullable = false)
        String lastName = nameParts.length > 1 ? nameParts[1] : firstName;

        // Create User entity
        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(firstName)
                .lastName(lastName)
                .userType("candidate") // Default to candidate for new registrations
                .build();

        // Save user to database
        User savedUser = userRepo.save(user);

        // Convert to DTO (password is excluded automatically)
        UserDTO userDto = userMapper.toDto(savedUser);

        // Generate simple token (can be replaced with JWT later)
        String token = generateToken(savedUser);

        return new AuthResponse(token, userDto, "User registered successfully");
    }

    /**
     * Authenticates a user with email and password.
     * 
     * @param request Login request containing email and password
     * @return AuthResponse containing token and user information
     * @throws UserNotFoundException if user not found
     * @throws IllegalArgumentException if password is incorrect
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepo.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new UserNotFoundException("Invalid email or password"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // Convert to DTO (password is excluded automatically)
        UserDTO userDto = userMapper.toDto(user);

        // Generate token
        String token = generateToken(user);

        return new AuthResponse(token, userDto, "Login successful");
    }

    /**
     * Updates user information during login (e.g., last login timestamp).
     * Currently updates the updatedAt timestamp.
     * 
     * @param user The user to update
     */
    @Transactional
    public void updateUserOnLogin(User user) {
        // Update last login timestamp (handled by @PreUpdate)
        userRepo.save(user);
    }

    /**
     * Splits a full name into firstName and lastName.
     * Handles various name formats.
     * 
     * @param fullName The full name to split
     * @return Array with [firstName, lastName]
     */
    private String[] splitName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return new String[]{"", ""};
        }

        String trimmed = fullName.trim();
        String[] parts = trimmed.split("\\s+", 2);

        if (parts.length == 1) {
            return new String[]{parts[0], ""};
        }

        return new String[]{parts[0], parts[1]};
    }

    /**
     * Generates a simple token for authentication.
     * Can be replaced with JWT implementation later.
     * 
     * @param user The user for whom to generate the token
     * @return Generated token string
     */
    private String generateToken(User user) {
        // Simple token generation - can be replaced with JWT
        // Format: userId-emailHash-timestamp
        String emailHash = String.valueOf(user.getEmail().hashCode());
        String timestamp = String.valueOf(System.currentTimeMillis());
        return user.getId() + "-" + emailHash + "-" + timestamp + "-" + UUID.randomUUID().toString().substring(0, 8);
    }
}
