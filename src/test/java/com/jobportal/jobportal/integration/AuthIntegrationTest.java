package com.jobportal.jobportal.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.jobportal.dto.auth.AuthResponse;
import com.jobportal.jobportal.dto.auth.LoginRequest;
import com.jobportal.jobportal.dto.auth.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for authentication endpoints.
 * Tests the complete authentication flow from controller through service to database.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // ==================== REGISTRATION INTEGRATION TESTS ====================

    @Test
    void register_WithValidData_ShouldCreateUserAndReturnToken() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("Integration Test User");
        request.setEmail("integration.test@example.com");
        request.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.user").exists())
                .andExpect(jsonPath("$.user.email").value("integration.test@example.com"))
                .andExpect(jsonPath("$.user.firstName").value("Integration"))
                .andExpect(jsonPath("$.user.lastName").value("Test User"))
                .andExpect(jsonPath("$.user.userType").value("candidate"))
                .andExpect(jsonPath("$.message").value("User registered successfully"));
    }

    @Test
    void register_WithDuplicateEmail_ShouldReturnBadRequest() throws Exception {
        // First registration
        RegisterRequest request1 = new RegisterRequest();
        request1.setName("First User");
        request1.setEmail("duplicate@example.com");
        request1.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isCreated());

        // Second registration with same email
        RegisterRequest request2 = new RegisterRequest();
        request2.setName("Second User");
        request2.setEmail("duplicate@example.com");
        request2.setPassword("password456");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("Email already registered")));
    }

    @Test
    void register_WithSingleWordName_ShouldUseForBothFirstAndLastName() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("Singleword");
        request.setEmail("singleword@example.com");
        request.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.user.firstName").value("Singleword"))
                .andExpect(jsonPath("$.user.lastName").value("Singleword"));
    }

    @Test
    void register_WithEmailCaseVariation_ShouldNormalizeToLowerCase() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("Case Test");
        request.setEmail("UPPERCASE@EXAMPLE.COM");
        request.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.user.email").value("uppercase@example.com"));
    }

    @Test
    void register_WithValidationErrors_ShouldReturnStructuredErrors() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("J"); // Too short
        request.setEmail("invalid-email"); // Invalid format
        request.setPassword("123"); // Too short

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation failed for one or more fields"))
                .andExpect(jsonPath("$.errors.name").exists())
                .andExpect(jsonPath("$.errors.email").exists())
                .andExpect(jsonPath("$.errors.password").exists());
    }

    // ==================== LOGIN INTEGRATION TESTS ====================

    @Test
    void login_WithValidCredentials_ShouldReturnToken() throws Exception {
        // First register a user
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("Login Test User");
        registerRequest.setEmail("login.test@example.com");
        registerRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        // Then login with the same credentials
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("login.test@example.com");
        loginRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.user").exists())
                .andExpect(jsonPath("$.user.email").value("login.test@example.com"))
                .andExpect(jsonPath("$.message").value("Login successful"));
    }

    @Test
    void login_WithNonExistentEmail_ShouldReturnNotFound() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("nonexistent@example.com");
        loginRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value(containsString("Invalid email or password")));
    }

    @Test
    void login_WithIncorrectPassword_ShouldReturnBadRequest() throws Exception {
        // First register a user
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("Password Test User");
        registerRequest.setEmail("password.test@example.com");
        registerRequest.setPassword("correctpassword");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        // Then login with wrong password
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("password.test@example.com");
        loginRequest.setPassword("wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("Invalid email or password")));
    }

    @Test
    void login_WithEmailCaseVariation_ShouldStillWork() throws Exception {
        // First register a user with lowercase email
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("Case Login Test");
        registerRequest.setEmail("caselogin@example.com");
        registerRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        // Then login with uppercase email (should normalize)
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("CASELOGIN@EXAMPLE.COM");
        loginRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("caselogin@example.com"));
    }

    @Test
    void login_WithValidationErrors_ShouldReturnStructuredErrors() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("invalid-email");
        loginRequest.setPassword("123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors.email").exists())
                .andExpect(jsonPath("$.errors.password").exists());
    }

    // ==================== END-TO-END FLOW TESTS ====================

    @Test
    void completeFlow_RegisterThenLogin_ShouldWork() throws Exception {
        // Register a new user
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("Flow Test User");
        registerRequest.setEmail("flow.test@example.com");
        registerRequest.setPassword("password123");

        String registerResponse = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        AuthResponse registerAuthResponse = objectMapper.readValue(registerResponse, AuthResponse.class);
        assertThat(registerAuthResponse.getToken()).isNotNull();
        assertThat(registerAuthResponse.getUser().getEmail()).isEqualTo("flow.test@example.com");

        // Login with the registered credentials
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("flow.test@example.com");
        loginRequest.setPassword("password123");

        String loginResponse = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        AuthResponse loginAuthResponse = objectMapper.readValue(loginResponse, AuthResponse.class);
        assertThat(loginAuthResponse.getToken()).isNotNull();
        assertThat(loginAuthResponse.getUser().getEmail()).isEqualTo("flow.test@example.com");
        
        // Tokens should be different (new token generated on each login)
        assertThat(loginAuthResponse.getToken()).isNotEqualTo(registerAuthResponse.getToken());
    }

    @Test
    void multipleLogins_ShouldGenerateDifferentTokens() throws Exception {
        // Register a user
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("Token Test User");
        registerRequest.setEmail("token.test@example.com");
        registerRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        // Login first time
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("token.test@example.com");
        loginRequest.setPassword("password123");

        String login1Response = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        AuthResponse login1 = objectMapper.readValue(login1Response, AuthResponse.class);

        // Login second time (should get different token)
        String login2Response = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        AuthResponse login2 = objectMapper.readValue(login2Response, AuthResponse.class);

        // Tokens should be different
        assertThat(login1.getToken()).isNotEqualTo(login2.getToken());
    }

    // ==================== ERROR RESPONSE FORMAT TESTS ====================

    @Test
    void authenticationError_ShouldHaveConsistentStructure() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("nonexistent@example.com");
        loginRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").isNumber())
                .andExpect(jsonPath("$.message").isString())
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.path").isString());
    }

    @Test
    void validationError_ShouldHaveConsistentStructure() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("J");
        request.setEmail("invalid");
        request.setPassword("123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").isNumber())
                .andExpect(jsonPath("$.message").isString())
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.path").isString())
                .andExpect(jsonPath("$.errors").isMap());
    }
}

