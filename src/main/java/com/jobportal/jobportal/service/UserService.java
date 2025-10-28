package com.jobportal.jobportal.service;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobportal.jobportal.customexceptionhandler.UserNotFoundException;
import com.jobportal.jobportal.dto.UserDTO;
import com.jobportal.jobportal.entity.User;
import com.jobportal.jobportal.mapper.UserMapper;
import com.jobportal.jobportal.repo.UserRepo;

/**
 * Service class for managing user operations.
 * Handles business logic for user CRUD operations.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepo repo;

    /**
     * Constructor for UserService.
     * 
     * @param repo Repository for user database operations
     */
    @Autowired
    public UserService(UserRepo repo) {
        this.repo = repo;
    }
    
    /**
     * Creates a new user.
     * 
     * @param userDto The user data to create
     * @return UserDTO containing the created user details
     */
    @Transactional
    public UserDTO create(UserDTO userDto) {
        User entity = UserMapper.dtoToEntity(userDto);
        User saved = repo.save(entity);
        return UserMapper.userEntityToDto(saved);
    }

    /**
     * Retrieves a user by their ID.
     * 
     * @param id The ID of the user to retrieve
     * @return UserDTO containing the user details
     * @throws UserNotFoundException if user is not found
     */
    public UserDTO getById(Long id) {
        return repo.findById(id)
            .map(UserMapper::userEntityToDto)
            .orElseThrow(() -> new UserNotFoundException(id));
    }

    /**
     * Retrieves a user by their email address.
     * 
     * @param email The email address of the user to retrieve
     * @return UserDTO containing the user details
     * @throws UserNotFoundException if user is not found
     */
    public UserDTO getByEmail(String email) {
        return repo.findByEmail(email)
            .map(UserMapper::userEntityToDto)
            .orElseThrow(() -> new UserNotFoundException(email));
    }

    /**
     * Retrieves all users in the system.
     * 
     * @return List of UserDTO objects for all users
     */
    public List<UserDTO> getAllUserList() {
        return repo.findAll().stream()
            .map(UserMapper::userEntityToDto)
            .toList();
    }

    /**
     * Updates an existing user.
     * 
     * @param id The ID of the user to update
     * @param dto The updated user data
     * @return UserDTO containing the updated user details
     * @throws UserNotFoundException if user is not found
     */
    @Transactional
    public UserDTO update(Long id, UserDTO dto) {
        User existing = repo.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setEmail(dto.getEmail());
        existing.setPhoneCountryCode(dto.getPhoneCountryCode());
        existing.setPhoneNumber(dto.getPhoneNumber());
        existing.setUserType(dto.getUserType());
        return UserMapper.userEntityToDto(repo.save(existing));
    }

    /**
     * Deletes a user by their ID.
     * 
     * @param id The ID of the user to delete
     * @throws UserNotFoundException if user is not found
     */
    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new UserNotFoundException(id);
        repo.deleteById(id);
    }
}
