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
    private final UserMapper userMapper;

    /**
     * Constructor for UserService.
     * 
     * @param repo Repository for user database operations
     * @param userMapper MapStruct mapper for User conversions
     */
    @Autowired
    public UserService(UserRepo repo, UserMapper userMapper) {
        this.repo = repo;
        this.userMapper = userMapper;
    }
    
    /**
     * Creates a new user.
     * 
     * @param userDto The user data to create
     * @return UserDTO containing the created user details
     */
    @Transactional
    public UserDTO create(UserDTO userDto) {
        User entity = userMapper.toEntity(userDto);
        User saved = repo.save(entity);
        return userMapper.toDto(saved);
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
            .map(userMapper::toDto)
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
            .map(userMapper::toDto)
            .orElseThrow(() -> new UserNotFoundException(email));
    }

    /**
     * Retrieves all users in the system.
     * 
     * @return List of UserDTO objects for all users
     */
    public List<UserDTO> getAllUserList() {
        return repo.findAll().stream()
            .map(userMapper::toDto)
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
        userMapper.updateEntity(dto, existing);
        return userMapper.toDto(repo.save(existing));
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
