package com.jobportal.jobportal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobportal.jobportal.dto.UserDTO;
import com.jobportal.jobportal.service.UserService;

import java.util.List;

/**
 * REST Controller for managing user operations.
 * Provides endpoints for CRUD operations on users.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService service;

    /**
     * Constructor for UserController.
     * 
     * @param service The service layer for user operations
     */
    @Autowired
    public UserController(UserService service) {
        this.service = service;
    }
    
    /**
     * Creates a new user.
     * 
     * @param user The user data to create
     * @return ResponseEntity containing the created user details
     */
    @PostMapping
    public ResponseEntity<UserDTO> create(@RequestBody UserDTO user) {
        return ResponseEntity.ok(service.create(user));
    }

    /**
     * Retrieves a user by their ID.
     * 
     * @param id The ID of the user to retrieve
     * @return ResponseEntity containing the user details
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    /**
     * Retrieves a user by their email address.
     * 
     * @param email The email address of the user to retrieve
     * @return ResponseEntity containing the user details
     */
    @GetMapping("/by-email/{email}")
    public ResponseEntity<UserDTO> getByEmail(@PathVariable String email) {
        return ResponseEntity.ok(service.getByEmail(email));
    }
    
    /**
     * Retrieves all users in the system.
     * 
     * @return ResponseEntity containing a list of all users
     */
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAll() {
        return ResponseEntity.ok(service.getAllUserList());
    }

    /**
     * Updates an existing user.
     * 
     * @param id The ID of the user to update
     * @param user The updated user data
     * @return ResponseEntity containing the updated user details
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> update(@PathVariable Long id, @RequestBody UserDTO user) {
        return ResponseEntity.ok(service.update(id, user));
    }

    /**
     * Deletes a user by their ID.
     * 
     * @param id The ID of the user to delete
     * @return ResponseEntity with no content on successful deletion
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
