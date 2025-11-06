package com.jobportal.jobportal.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobportal.jobportal.dto.auth.AuthResponse;
import com.jobportal.jobportal.dto.auth.LoginRequest;
import com.jobportal.jobportal.dto.auth.RegisterRequest;
import com.jobportal.jobportal.service.AuthService;

/**
 * REST Controller for authentication operations.
 * Handles user registration and login endpoints.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    /**
     * Constructor for AuthController.
     * 
     * @param authService The authentication service
     */
    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * User registration endpoint.
     * Creates a new user account with email and password.
     * 
     * @param request Registration request containing name, email, and password
     * @return ResponseEntity containing authentication response with token and user data
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * User login endpoint.
     * Authenticates user with email and password.
     * 
     * @param request Login request containing email and password
     * @return ResponseEntity containing authentication response with token and user data
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
