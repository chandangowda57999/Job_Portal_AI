package com.jobportal.jobportal.service;

import com.jobportal.jobportal.customexceptionhandler.UserNotFoundException;
import com.jobportal.jobportal.dto.auth.AuthResponse;
import com.jobportal.jobportal.dto.auth.LoginRequest;
import com.jobportal.jobportal.dto.auth.RegisterRequest;
import com.jobportal.jobportal.dto.UserDTO;
import com.jobportal.jobportal.entity.User;
import com.jobportal.jobportal.mapper.UserMapper;
import com.jobportal.jobportal.repo.UserRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AuthService.
 * Tests authentication business logic including registration and login.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepo userRepo;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User user;
    private UserDTO userDTO;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("$2a$10$hashedPasswordHere")
                .userType("candidate")
                .build();

        userDTO = new UserDTO();
        userDTO.setId(1L);
        userDTO.setFirstName("John");
        userDTO.setLastName("Doe");
        userDTO.setEmail("john.doe@example.com");
        userDTO.setUserType("candidate");

        registerRequest = new RegisterRequest();
        registerRequest.setName("John Doe");
        registerRequest.setEmail("john.doe@example.com");
        registerRequest.setPassword("password123");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("john.doe@example.com");
        loginRequest.setPassword("password123");
    }

    // ==================== REGISTER TESTS ====================

    @Test
    void register_WithValidData_ShouldReturnAuthResponse() {
        // Given
        when(userRepo.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$hashedPassword");
        when(userRepo.save(any(User.class))).thenReturn(user);
        when(userMapper.toDto(any(User.class))).thenReturn(userDTO);

        // When
        AuthResponse result = authService.register(registerRequest);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getToken()).isNotNull();
        assertThat(result.getUser()).isNotNull();
        assertThat(result.getUser().getEmail()).isEqualTo("john.doe@example.com");
        assertThat(result.getUser().getFirstName()).isEqualTo("John");
        assertThat(result.getUser().getLastName()).isEqualTo("Doe");
        assertThat(result.getMessage()).isEqualTo("User registered successfully");

        verify(userRepo, times(1)).findByEmail(anyString());
        verify(passwordEncoder, times(1)).encode(anyString());
        verify(userRepo, times(1)).save(any(User.class));
        verify(userMapper, times(1)).toDto(any(User.class));
    }

    @Test
    void register_WithEmailAlreadyExists_ShouldThrowException() {
        // Given
        when(userRepo.findByEmail(anyString())).thenReturn(Optional.of(user));

        // When & Then
        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email already registered");

        verify(userRepo, times(1)).findByEmail(anyString());
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepo, never()).save(any(User.class));
    }

    @Test
    void register_WithSingleWordName_ShouldUseSameForFirstNameAndLastName() {
        // Given
        registerRequest.setName("John");
        when(userRepo.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$hashedPassword");
        when(userRepo.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            assertThat(savedUser.getFirstName()).isEqualTo("John");
            assertThat(savedUser.getLastName()).isEqualTo("John");
            return user;
        });
        when(userMapper.toDto(any(User.class))).thenReturn(userDTO);

        // When
        AuthResponse result = authService.register(registerRequest);

        // Then
        assertThat(result).isNotNull();
        verify(userRepo, times(1)).save(any(User.class));
    }

    @Test
    void register_WithMultiWordName_ShouldSplitCorrectly() {
        // Given
        registerRequest.setName("John Michael Doe");
        when(userRepo.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$hashedPassword");
        when(userRepo.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            assertThat(savedUser.getFirstName()).isEqualTo("John");
            assertThat(savedUser.getLastName()).isEqualTo("Michael Doe");
            return user;
        });
        when(userMapper.toDto(any(User.class))).thenReturn(userDTO);

        // When
        AuthResponse result = authService.register(registerRequest);

        // Then
        assertThat(result).isNotNull();
        verify(userRepo, times(1)).save(any(User.class));
    }

    @Test
    void register_ShouldNormalizeEmailToLowerCase() {
        // Given
        registerRequest.setEmail("JOHN.DOE@EXAMPLE.COM");
        when(userRepo.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$hashedPassword");
        when(userRepo.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            assertThat(savedUser.getEmail()).isEqualTo("john.doe@example.com");
            return user;
        });
        when(userMapper.toDto(any(User.class))).thenReturn(userDTO);

        // When
        AuthResponse result = authService.register(registerRequest);

        // Then
        assertThat(result).isNotNull();
        verify(userRepo, times(1)).save(any(User.class));
    }

    @Test
    void register_ShouldHashPassword() {
        // Given
        String rawPassword = "password123";
        String hashedPassword = "$2a$10$hashedPassword";
        when(userRepo.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(rawPassword)).thenReturn(hashedPassword);
        when(userRepo.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            assertThat(savedUser.getPassword()).isEqualTo(hashedPassword);
            return user;
        });
        when(userMapper.toDto(any(User.class))).thenReturn(userDTO);

        // When
        AuthResponse result = authService.register(registerRequest);

        // Then
        assertThat(result).isNotNull();
        verify(passwordEncoder, times(1)).encode(rawPassword);
    }

    // ==================== LOGIN TESTS ====================

    @Test
    void login_WithValidCredentials_ShouldReturnAuthResponse() {
        // Given
        when(userRepo.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(userMapper.toDto(any(User.class))).thenReturn(userDTO);

        // When
        AuthResponse result = authService.login(loginRequest);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getToken()).isNotNull();
        assertThat(result.getUser()).isNotNull();
        assertThat(result.getUser().getEmail()).isEqualTo("john.doe@example.com");
        assertThat(result.getMessage()).isEqualTo("Login successful");

        verify(userRepo, times(1)).findByEmail(anyString());
        verify(passwordEncoder, times(1)).matches(anyString(), anyString());
        verify(userMapper, times(1)).toDto(any(User.class));
    }

    @Test
    void login_WithNonExistentEmail_ShouldThrowUserNotFoundException() {
        // Given
        when(userRepo.findByEmail(anyString())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("Invalid email or password");

        verify(userRepo, times(1)).findByEmail(anyString());
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void login_WithIncorrectPassword_ShouldThrowException() {
        // Given
        when(userRepo.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        // When & Then
        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid email or password");

        verify(userRepo, times(1)).findByEmail(anyString());
        verify(passwordEncoder, times(1)).matches(anyString(), anyString());
        verify(userMapper, never()).toDto(any(User.class));
    }

    @Test
    void login_ShouldNormalizeEmailToLowerCase() {
        // Given
        loginRequest.setEmail("JOHN.DOE@EXAMPLE.COM");
        when(userRepo.findByEmail("john.doe@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(userMapper.toDto(any(User.class))).thenReturn(userDTO);

        // When
        AuthResponse result = authService.login(loginRequest);

        // Then
        assertThat(result).isNotNull();
        verify(userRepo, times(1)).findByEmail("john.doe@example.com");
    }

    @Test
    void login_ShouldVerifyPassword() {
        // Given
        String rawPassword = "password123";
        String hashedPassword = "$2a$10$hashedPasswordHere";
        when(userRepo.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(rawPassword, hashedPassword)).thenReturn(true);
        when(userMapper.toDto(any(User.class))).thenReturn(userDTO);

        // When
        AuthResponse result = authService.login(loginRequest);

        // Then
        assertThat(result).isNotNull();
        verify(passwordEncoder, times(1)).matches(rawPassword, hashedPassword);
    }

    // ==================== TOKEN GENERATION TESTS ====================

    @Test
    void register_ShouldGenerateUniqueTokens() {
        // Given
        when(userRepo.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$hashedPassword");
        when(userRepo.save(any(User.class))).thenReturn(user);
        when(userMapper.toDto(any(User.class))).thenReturn(userDTO);

        // When
        AuthResponse result1 = authService.register(registerRequest);
        
        registerRequest.setEmail("another@example.com");
        when(userRepo.findByEmail("another@example.com")).thenReturn(Optional.empty());
        AuthResponse result2 = authService.register(registerRequest);

        // Then
        assertThat(result1.getToken()).isNotNull();
        assertThat(result2.getToken()).isNotNull();
        // Tokens should be different (even if generated quickly)
        assertThat(result1.getToken()).isNotEqualTo(result2.getToken());
    }

    @Test
    void login_ShouldGenerateUniqueTokens() {
        // Given
        when(userRepo.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(userMapper.toDto(any(User.class))).thenReturn(userDTO);

        // When
        AuthResponse result1 = authService.login(loginRequest);
        AuthResponse result2 = authService.login(loginRequest);

        // Then
        assertThat(result1.getToken()).isNotNull();
        assertThat(result2.getToken()).isNotNull();
        // Tokens should be different (even if generated quickly)
        assertThat(result1.getToken()).isNotEqualTo(result2.getToken());
    }
}

