package com.jobportal.jobportal.service;

import com.jobportal.jobportal.customexceptionhandler.UserNotFoundException;
import com.jobportal.jobportal.dto.UserDTO;
import com.jobportal.jobportal.entity.User;
import com.jobportal.jobportal.repo.UserRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for UserService.
 * Tests business logic and repository interactions.
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepo userRepo;

    @InjectMocks
    private UserService userService;

    private User user;
    private UserDTO userDTO;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .phoneNumber("1234567890")
                .phoneCountryCode("+1")
                .userType("candidate")
                .build();

        userDTO = new UserDTO();
        userDTO.setId(1L);
        userDTO.setFirstName("John");
        userDTO.setLastName("Doe");
        userDTO.setEmail("john.doe@example.com");
        userDTO.setPhoneNumber("1234567890");
        userDTO.setPhoneCountryCode("+1");
        userDTO.setUserType("candidate");
    }

    // ==================== CREATE TESTS ====================

    @Test
    void create_WithValidData_ShouldReturnCreatedUser() {
        when(userRepo.save(any(User.class))).thenReturn(user);

        UserDTO result = userService.create(userDTO);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getFirstName()).isEqualTo("John");
        assertThat(result.getLastName()).isEqualTo("Doe");
        assertThat(result.getEmail()).isEqualTo("john.doe@example.com");
        verify(userRepo, times(1)).save(any(User.class));
    }

    @Test
    void create_ShouldMapDTOToEntityCorrectly() {
        when(userRepo.save(any(User.class))).thenReturn(user);

        UserDTO result = userService.create(userDTO);

        assertThat(result.getUserType()).isEqualTo("candidate");
        assertThat(result.getPhoneNumber()).isEqualTo("1234567890");
        assertThat(result.getPhoneCountryCode()).isEqualTo("+1");
        verify(userRepo, times(1)).save(any(User.class));
    }

    // ==================== GET BY ID TESTS ====================

    @Test
    void getById_WithExistingId_ShouldReturnUser() {
        when(userRepo.findById(1L)).thenReturn(Optional.of(user));

        UserDTO result = userService.getById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getFirstName()).isEqualTo("John");
        verify(userRepo, times(1)).findById(1L);
    }

    @Test
    void getById_WithNonExistentId_ShouldThrowException() {
        when(userRepo.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getById(999L))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("999");

        verify(userRepo, times(1)).findById(999L);
    }

    // ==================== GET BY EMAIL TESTS ====================

    @Test
    void getByEmail_WithExistingEmail_ShouldReturnUser() {
        when(userRepo.findByEmail("john.doe@example.com")).thenReturn(Optional.of(user));

        UserDTO result = userService.getByEmail("john.doe@example.com");

        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("john.doe@example.com");
        verify(userRepo, times(1)).findByEmail("john.doe@example.com");
    }

    @Test
    void getByEmail_WithNonExistentEmail_ShouldThrowException() {
        String email = "nonexistent@example.com";
        when(userRepo.findByEmail(email)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getByEmail(email))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining(email);

        verify(userRepo, times(1)).findByEmail(email);
    }

    // ==================== GET ALL TESTS ====================

    @Test
    void getAllUserList_ShouldReturnAllUsers() {
        User user2 = User.builder()
                .id(2L)
                .firstName("Jane")
                .lastName("Smith")
                .email("jane.smith@example.com")
                .userType("employer")
                .build();

        List<User> users = Arrays.asList(user, user2);
        when(userRepo.findAll()).thenReturn(users);

        List<UserDTO> result = userService.getAllUserList();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getFirstName()).isEqualTo("John");
        assertThat(result.get(1).getFirstName()).isEqualTo("Jane");
        verify(userRepo, times(1)).findAll();
    }

    @Test
    void getAllUserList_WhenEmpty_ShouldReturnEmptyList() {
        when(userRepo.findAll()).thenReturn(Arrays.asList());

        List<UserDTO> result = userService.getAllUserList();

        assertThat(result).isEmpty();
        verify(userRepo, times(1)).findAll();
    }

    // ==================== UPDATE TESTS ====================

    @Test
    void update_WithValidData_ShouldReturnUpdatedUser() {
        UserDTO updateDTO = new UserDTO();
        updateDTO.setFirstName("John");
        updateDTO.setLastName("Updated");
        updateDTO.setEmail("john.updated@example.com");
        updateDTO.setPhoneNumber("9876543210");
        updateDTO.setPhoneCountryCode("+1");
        updateDTO.setUserType("candidate");

        User updatedUser = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Updated")
                .email("john.updated@example.com")
                .phoneNumber("9876543210")
                .phoneCountryCode("+1")
                .userType("candidate")
                .build();

        when(userRepo.findById(1L)).thenReturn(Optional.of(user));
        when(userRepo.save(any(User.class))).thenReturn(updatedUser);

        UserDTO result = userService.update(1L, updateDTO);

        assertThat(result).isNotNull();
        assertThat(result.getLastName()).isEqualTo("Updated");
        assertThat(result.getEmail()).isEqualTo("john.updated@example.com");
        assertThat(result.getPhoneNumber()).isEqualTo("9876543210");
        verify(userRepo, times(1)).findById(1L);
        verify(userRepo, times(1)).save(any(User.class));
    }

    @Test
    void update_WithNonExistentId_ShouldThrowException() {
        when(userRepo.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.update(999L, userDTO))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("999");

        verify(userRepo, times(1)).findById(999L);
        verify(userRepo, never()).save(any(User.class));
    }

    @Test
    void update_ShouldUpdateAllFields() {
        UserDTO updateDTO = new UserDTO();
        updateDTO.setFirstName("UpdatedFirstName");
        updateDTO.setLastName("UpdatedLastName");
        updateDTO.setEmail("updated@example.com");
        updateDTO.setPhoneNumber("1111111111");
        updateDTO.setPhoneCountryCode("+44");
        updateDTO.setUserType("employer");

        when(userRepo.findById(1L)).thenReturn(Optional.of(user));
        when(userRepo.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserDTO result = userService.update(1L, updateDTO);

        assertThat(result.getFirstName()).isEqualTo("UpdatedFirstName");
        assertThat(result.getLastName()).isEqualTo("UpdatedLastName");
        assertThat(result.getEmail()).isEqualTo("updated@example.com");
        assertThat(result.getUserType()).isEqualTo("employer");
        verify(userRepo, times(1)).save(any(User.class));
    }

    // ==================== DELETE TESTS ====================

    @Test
    void delete_WithExistingId_ShouldDeleteUser() {
        when(userRepo.existsById(1L)).thenReturn(true);
        doNothing().when(userRepo).deleteById(1L);

        assertThatCode(() -> userService.delete(1L))
                .doesNotThrowAnyException();

        verify(userRepo, times(1)).existsById(1L);
        verify(userRepo, times(1)).deleteById(1L);
    }

    @Test
    void delete_WithNonExistentId_ShouldThrowException() {
        when(userRepo.existsById(999L)).thenReturn(false);

        assertThatThrownBy(() -> userService.delete(999L))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("999");

        verify(userRepo, times(1)).existsById(999L);
        verify(userRepo, never()).deleteById(anyLong());
    }
}

