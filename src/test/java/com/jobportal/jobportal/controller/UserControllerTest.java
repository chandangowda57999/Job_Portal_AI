package com.jobportal.jobportal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.jobportal.customexceptionhandler.UserNotFoundException;
import com.jobportal.jobportal.dto.UserDTO;
import com.jobportal.jobportal.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for UserController.
 * Tests validation, error handling, and controller behavior.
 */
@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    private UserDTO validUser;

    @BeforeEach
    void setUp() {
        validUser = new UserDTO();
        validUser.setId(1L);
        validUser.setFirstName("John");
        validUser.setLastName("Doe");
        validUser.setEmail("john.doe@example.com");
        validUser.setPhoneNumber("1234567890");
        validUser.setPhoneCountryCode("+1");
        validUser.setUserType("candidate");
    }

    // ==================== CREATE TESTS ====================

    @Test
    void createUser_WithValidData_ShouldReturnCreatedUser() throws Exception {
        when(userService.create(any(UserDTO.class))).thenReturn(validUser);

        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.userType").value("candidate"));

        verify(userService, times(1)).create(any(UserDTO.class));
    }

    @Test
    void createUser_WithMissingFirstName_ShouldReturnBadRequest() throws Exception {
        UserDTO invalidUser = new UserDTO();
        invalidUser.setLastName("Doe");
        invalidUser.setEmail("john.doe@example.com");
        invalidUser.setUserType("candidate");

        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation failed for one or more fields"))
                .andExpect(jsonPath("$.errors.firstName").value("First name is required"));

        verify(userService, never()).create(any(UserDTO.class));
    }

    @Test
    void createUser_WithInvalidEmail_ShouldReturnBadRequest() throws Exception {
        UserDTO invalidUser = new UserDTO();
        invalidUser.setFirstName("John");
        invalidUser.setLastName("Doe");
        invalidUser.setEmail("invalid-email");
        invalidUser.setUserType("candidate");

        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").value("Email must be a valid email address"));

        verify(userService, never()).create(any(UserDTO.class));
    }

    @Test
    void createUser_WithShortFirstName_ShouldReturnBadRequest() throws Exception {
        UserDTO invalidUser = new UserDTO();
        invalidUser.setFirstName("J");
        invalidUser.setLastName("Doe");
        invalidUser.setEmail("john.doe@example.com");
        invalidUser.setUserType("candidate");

        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.firstName").value("First name must be between 2 and 120 characters"));

        verify(userService, never()).create(any(UserDTO.class));
    }

    @Test
    void createUser_WithInvalidUserType_ShouldReturnBadRequest() throws Exception {
        UserDTO invalidUser = new UserDTO();
        invalidUser.setFirstName("John");
        invalidUser.setLastName("Doe");
        invalidUser.setEmail("john.doe@example.com");
        invalidUser.setUserType("invalid_type");

        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.userType").exists());

        verify(userService, never()).create(any(UserDTO.class));
    }

    @Test
    void createUser_WithInvalidPhoneNumber_ShouldReturnBadRequest() throws Exception {
        UserDTO invalidUser = new UserDTO();
        invalidUser.setFirstName("John");
        invalidUser.setLastName("Doe");
        invalidUser.setEmail("john.doe@example.com");
        invalidUser.setPhoneNumber("123"); // Too short
        invalidUser.setUserType("candidate");

        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.phoneNumber").exists());

        verify(userService, never()).create(any(UserDTO.class));
    }

    @Test
    void createUser_WithMultipleValidationErrors_ShouldReturnAllErrors() throws Exception {
        UserDTO invalidUser = new UserDTO();
        invalidUser.setFirstName("J");
        invalidUser.setEmail("invalid");
        invalidUser.setUserType("wrong");

        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.firstName").exists())
                .andExpect(jsonPath("$.errors.lastName").exists())
                .andExpect(jsonPath("$.errors.email").exists())
                .andExpect(jsonPath("$.errors.userType").exists());

        verify(userService, never()).create(any(UserDTO.class));
    }

    // ==================== GET BY ID TESTS ====================

    @Test
    void getUserById_WithValidId_ShouldReturnUser() throws Exception {
        when(userService.getById(1L)).thenReturn(validUser);

        mockMvc.perform(get("/api/v1/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"));

        verify(userService, times(1)).getById(1L);
    }

    @Test
    void getUserById_WithInvalidId_ShouldReturnNotFound() throws Exception {
        when(userService.getById(999L)).thenThrow(new UserNotFoundException(999L));

        mockMvc.perform(get("/api/v1/users/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("User not found with id: 999"));

        verify(userService, times(1)).getById(999L);
    }

    // ==================== GET BY EMAIL TESTS ====================

    @Test
    void getUserByEmail_WithValidEmail_ShouldReturnUser() throws Exception {
        when(userService.getByEmail("john.doe@example.com")).thenReturn(validUser);

        mockMvc.perform(get("/api/v1/users/by-email/john.doe@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("john.doe@example.com"));

        verify(userService, times(1)).getByEmail("john.doe@example.com");
    }

    @Test
    void getUserByEmail_WithNonExistentEmail_ShouldReturnNotFound() throws Exception {
        String email = "nonexistent@example.com";
        when(userService.getByEmail(email)).thenThrow(new UserNotFoundException(email));

        mockMvc.perform(get("/api/v1/users/by-email/" + email))
                .andExpect(status().isNotFound());

        verify(userService, times(1)).getByEmail(email);
    }

    // ==================== GET ALL TESTS ====================

    @Test
    void getAllUsers_ShouldReturnUserList() throws Exception {
        UserDTO user2 = new UserDTO();
        user2.setId(2L);
        user2.setFirstName("Jane");
        user2.setLastName("Smith");
        user2.setEmail("jane.smith@example.com");
        user2.setUserType("employer");

        List<UserDTO> users = Arrays.asList(validUser, user2);
        when(userService.getAllUserList()).thenReturn(users);

        mockMvc.perform(get("/api/v1/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].firstName").value("John"))
                .andExpect(jsonPath("$[1].firstName").value("Jane"));

        verify(userService, times(1)).getAllUserList();
    }

    @Test
    void getAllUsers_WhenEmpty_ShouldReturnEmptyList() throws Exception {
        when(userService.getAllUserList()).thenReturn(Arrays.asList());

        mockMvc.perform(get("/api/v1/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        verify(userService, times(1)).getAllUserList();
    }

    // ==================== UPDATE TESTS ====================

    @Test
    void updateUser_WithValidData_ShouldReturnUpdatedUser() throws Exception {
        UserDTO updatedUser = new UserDTO();
        updatedUser.setId(1L);
        updatedUser.setFirstName("John");
        updatedUser.setLastName("Updated");
        updatedUser.setEmail("john.updated@example.com");
        updatedUser.setUserType("candidate");

        when(userService.update(eq(1L), any(UserDTO.class))).thenReturn(updatedUser);

        mockMvc.perform(put("/api/v1/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastName").value("Updated"))
                .andExpect(jsonPath("$.email").value("john.updated@example.com"));

        verify(userService, times(1)).update(eq(1L), any(UserDTO.class));
    }

    @Test
    void updateUser_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        UserDTO invalidUser = new UserDTO();
        invalidUser.setFirstName("J");
        invalidUser.setEmail("invalid");
        invalidUser.setUserType("candidate");

        mockMvc.perform(put("/api/v1/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors").exists());

        verify(userService, never()).update(eq(1L), any(UserDTO.class));
    }

    @Test
    void updateUser_WithNonExistentId_ShouldReturnNotFound() throws Exception {
        when(userService.update(eq(999L), any(UserDTO.class)))
                .thenThrow(new UserNotFoundException(999L));

        mockMvc.perform(put("/api/v1/users/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validUser)))
                .andExpect(status().isNotFound());

        verify(userService, times(1)).update(eq(999L), any(UserDTO.class));
    }

    // ==================== DELETE TESTS ====================

    @Test
    void deleteUser_WithValidId_ShouldReturnNoContent() throws Exception {
        doNothing().when(userService).delete(1L);

        mockMvc.perform(delete("/api/v1/users/1"))
                .andExpect(status().isNoContent());

        verify(userService, times(1)).delete(1L);
    }

    @Test
    void deleteUser_WithNonExistentId_ShouldReturnNotFound() throws Exception {
        doThrow(new UserNotFoundException(999L)).when(userService).delete(999L);

        mockMvc.perform(delete("/api/v1/users/999"))
                .andExpect(status().isNotFound());

        verify(userService, times(1)).delete(999L);
    }
}

