package com.jobportal.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobportal.jobportal.dto.auth.ApiTokenRequest;
import com.jobportal.jobportal.dto.auth.AuthResponse;
import com.jobportal.jobportal.dto.auth.LoginRequest;
import com.jobportal.jobportal.dto.auth.RegisterRequest;
import com.jobportal.jobportal.dto.UserDTO;
import com.jobportal.jobportal.entity.User;
import com.jobportal.jobportal.mapper.UserMapper;
import com.jobportal.jobportal.repo.UserRepo;
import com.jobportal.jobportal.util.JwtUtil;

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
    private final JwtUtil jwtUtil;

    @Value("${jwt.secret}")
    private String jwtSecret;

    /**
     * Constructor for AuthService.
     * 
     * @param userRepo Repository for user database operations
     * @param userMapper MapStruct mapper for User conversions
     * @param passwordEncoder BCrypt password encoder for hashing passwords
     * @param jwtUtil JWT utility for token generation and validation
     */
    @Autowired
    public AuthService(UserRepo userRepo, UserMapper userMapper, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Registers a new user with email and password.
     * Password is encrypted using BCrypt before storing in database.
     * Password validation: minimum 8 characters and must contain at least one letter.
     * 
     * @param request Registration request containing name, email, and password
     * @return AuthResponse containing token and user information
     * @throws IllegalArgumentException if email already exists or validation fails
     */
    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered. Please sign in instead.");
        }

        // Split name into firstName and lastName
        String[] nameParts = splitName(request.getName());
        String firstName = nameParts[0];
        // If only one name part, set lastName to empty string (not firstName)
        // Database requires non-null, so we use empty string instead of duplicating firstName
        String lastName = (nameParts.length > 1 && !nameParts[1].isEmpty()) ? nameParts[1] : "";

        // Create User entity
        // Password is encrypted with BCrypt before storing (never stored in plain text)
        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))  // BCrypt encryption
                .firstName(firstName)
                .lastName(lastName)
                .userType("candidate") // Default to candidate for new registrations
                .build();

        // Save user to database
        User savedUser = userRepo.save(user);

        // Convert to DTO (password is excluded automatically)
        UserDTO userDto = userMapper.toDto(savedUser);

        // Generate JWT token with user information
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getId(), savedUser.getUserType());

        return new AuthResponse(token, userDto, "User registered successfully");
    }

    /**
     * Authenticates a user with email and password.
     * Compares plain text password with BCrypt hashed password stored in database.
     * Password validation: minimum 8 characters and must contain at least one letter.
     * 
     * @param request Login request containing email and password
     * @return AuthResponse containing token and user information
     * @throws IllegalArgumentException if credentials are invalid (user not found or password incorrect)
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // Find user by email
        // Use generic message for security - don't reveal if email exists
        User user = userRepo.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        // Verify password: compares plain text password with BCrypt hashed password
        // Use generic message for security - don't reveal if password is wrong
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // Convert to DTO (password is excluded automatically)
        UserDTO userDto = userMapper.toDto(user);

        // Generate JWT token with user information
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getUserType());

        return new AuthResponse(token, userDto, "Login successful");
    }

    /**
     * Generates a JWT token using JWT secret from configuration.
     * Validates the provided secret against jwt.secret from properties.
     * Generates a token based solely on secret validation (no user information required).
     * 
     * @param request API token request containing secret
     * @return AuthResponse containing token (user will be null)
     * @throws IllegalArgumentException if JWT secret is invalid
     */
    @Transactional(readOnly = true)
    public AuthResponse generateApiToken(ApiTokenRequest request) {
        // Check if request is null or fields are null
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }
        
        if (request.getSecret() == null || request.getSecret().trim().isEmpty()) {
            throw new IllegalArgumentException("Secret is required");
        }

        String providedSecret = request.getSecret().trim();

        // Validate JWT secret (must match jwt.secret from properties)
        if (jwtSecret == null || jwtSecret.isEmpty()) {
            throw new IllegalArgumentException("JWT secret configuration is missing. Please check application.properties");
        }
        
        if (!jwtSecret.equals(providedSecret)) {
            throw new IllegalArgumentException("Invalid secret. The provided secret does not match the configured JWT secret");
        }

        // Generate JWT token using only the secret (no user information)
        String token = jwtUtil.generateTokenFromSecret();

        return new AuthResponse(token, null, "Token generated successfully");
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

}
