package com.jobportal.jobportal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.jobportal.dto.auth.AuthResponse;
import com.jobportal.jobportal.dto.auth.LoginRequest;
import com.jobportal.jobportal.dto.auth.RegisterRequest;
import com.jobportal.jobportal.dto.UserDTO;
import com.jobportal.jobportal.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for AuthController.
 * Tests validation, error handling, and controller behavior.
 */
@WebMvcTest(controllers = AuthController.class, excludeAutoConfiguration = {
    org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
    org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration.class
})
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    private RegisterRequest validRegisterRequest;
    private LoginRequest validLoginRequest;
    private AuthResponse authResponse;
    private UserDTO userDTO;

    @BeforeEach
    void setUp() {
        userDTO = new UserDTO();
        userDTO.setId(1L);
        userDTO.setFirstName("John");
        userDTO.setLastName("Doe");
        userDTO.setEmail("john.doe@example.com");
        userDTO.setUserType("candidate");

        validRegisterRequest = new RegisterRequest();
        validRegisterRequest.setName("John Doe");
        validRegisterRequest.setEmail("john.doe@example.com");
        validRegisterRequest.setPassword("password123");

        validLoginRequest = new LoginRequest();
        validLoginRequest.setEmail("john.doe@example.com");
        validLoginRequest.setPassword("password123");

        authResponse = new AuthResponse();
        authResponse.setToken("test-token-123");
        authResponse.setUser(userDTO);
        authResponse.setMessage("User registered successfully");
    }

    // ==================== REGISTER TESTS ====================

    @Test
    void register_WithValidData_ShouldReturnCreated() throws Exception {
        when(authService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("test-token-123"))
                .andExpect(jsonPath("$.user.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.user.firstName").value("John"))
                .andExpect(jsonPath("$.user.lastName").value("Doe"))
                .andExpect(jsonPath("$.message").value("User registered successfully"));

        verify(authService, times(1)).register(any(RegisterRequest.class));
    }

    @Test
    void register_WithMissingName_ShouldReturnBadRequest() throws Exception {
        RegisterRequest invalidRequest = new RegisterRequest();
        invalidRequest.setEmail("john.doe@example.com");
        invalidRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors.name").value("Name is required"));

        verify(authService, never()).register(any(RegisterRequest.class));
    }

    @Test
    void register_WithMissingEmail_ShouldReturnBadRequest() throws Exception {
        RegisterRequest invalidRequest = new RegisterRequest();
        invalidRequest.setName("John Doe");
        invalidRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").value("Email is required"));

        verify(authService, never()).register(any(RegisterRequest.class));
    }

    @Test
    void register_WithMissingPassword_ShouldReturnBadRequest() throws Exception {
        RegisterRequest invalidRequest = new RegisterRequest();
        invalidRequest.setName("John Doe");
        invalidRequest.setEmail("john.doe@example.com");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.password").value("Password is required"));

        verify(authService, never()).register(any(RegisterRequest.class));
    }

    @Test
    void register_WithInvalidEmail_ShouldReturnBadRequest() throws Exception {
        RegisterRequest invalidRequest = new RegisterRequest();
        invalidRequest.setName("John Doe");
        invalidRequest.setEmail("invalid-email");
        invalidRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").value("Email must be a valid email address"));

        verify(authService, never()).register(any(RegisterRequest.class));
    }

    @Test
    void register_WithShortPassword_ShouldReturnBadRequest() throws Exception {
        RegisterRequest invalidRequest = new RegisterRequest();
        invalidRequest.setName("John Doe");
        invalidRequest.setEmail("john.doe@example.com");
        invalidRequest.setPassword("12345"); // Less than 6 characters

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.password").value("Password must be at least 6 characters"));

        verify(authService, never()).register(any(RegisterRequest.class));
    }

    @Test
    void register_WithShortName_ShouldReturnBadRequest() throws Exception {
        RegisterRequest invalidRequest = new RegisterRequest();
        invalidRequest.setName("J"); // Less than 2 characters
        invalidRequest.setEmail("john.doe@example.com");
        invalidRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").exists());

        verify(authService, never()).register(any(RegisterRequest.class));
    }

    @Test
    void register_WithInvalidNameCharacters_ShouldReturnBadRequest() throws Exception {
        RegisterRequest invalidRequest = new RegisterRequest();
        invalidRequest.setName("John123 Doe"); // Contains numbers
        invalidRequest.setEmail("john.doe@example.com");
        invalidRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").value(containsString("can only contain letters")));

        verify(authService, never()).register(any(RegisterRequest.class));
    }

    @Test
    void register_WithMultipleValidationErrors_ShouldReturnAllErrors() throws Exception {
        RegisterRequest invalidRequest = new RegisterRequest();
        invalidRequest.setName("J"); // Too short
        invalidRequest.setEmail("invalid"); // Invalid email
        invalidRequest.setPassword("123"); // Too short

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").exists())
                .andExpect(jsonPath("$.errors.email").exists())
                .andExpect(jsonPath("$.errors.password").exists());

        verify(authService, never()).register(any(RegisterRequest.class));
    }

    // ==================== LOGIN TESTS ====================

    @Test
    void login_WithValidCredentials_ShouldReturnOk() throws Exception {
        authResponse.setMessage("Login successful");
        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validLoginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("test-token-123"))
                .andExpect(jsonPath("$.user.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.message").value("Login successful"));

        verify(authService, times(1)).login(any(LoginRequest.class));
    }

    @Test
    void login_WithMissingEmail_ShouldReturnBadRequest() throws Exception {
        LoginRequest invalidRequest = new LoginRequest();
        invalidRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").value("Email is required"));

        verify(authService, never()).login(any(LoginRequest.class));
    }

    @Test
    void login_WithMissingPassword_ShouldReturnBadRequest() throws Exception {
        LoginRequest invalidRequest = new LoginRequest();
        invalidRequest.setEmail("john.doe@example.com");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.password").value("Password is required"));

        verify(authService, never()).login(any(LoginRequest.class));
    }

    @Test
    void login_WithInvalidEmail_ShouldReturnBadRequest() throws Exception {
        LoginRequest invalidRequest = new LoginRequest();
        invalidRequest.setEmail("invalid-email");
        invalidRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").value("Email must be a valid email address"));

        verify(authService, never()).login(any(LoginRequest.class));
    }

    @Test
    void login_WithShortPassword_ShouldReturnBadRequest() throws Exception {
        LoginRequest invalidRequest = new LoginRequest();
        invalidRequest.setEmail("john.doe@example.com");
        invalidRequest.setPassword("12345"); // Less than 6 characters

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.password").value("Password must be at least 6 characters"));

        verify(authService, never()).login(any(LoginRequest.class));
    }

    @Test
    void login_WithMultipleValidationErrors_ShouldReturnAllErrors() throws Exception {
        LoginRequest invalidRequest = new LoginRequest();
        invalidRequest.setEmail("invalid");
        invalidRequest.setPassword("123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").exists())
                .andExpect(jsonPath("$.errors.password").exists());

        verify(authService, never()).login(any(LoginRequest.class));
    }
}

