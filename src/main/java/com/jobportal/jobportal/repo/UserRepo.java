package com.jobportal.jobportal.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jobportal.jobportal.entity.User;

import java.util.Optional;

/**
 * Repository interface for User entity operations.
 * Extends JpaRepository to provide basic CRUD operations and custom queries.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
public interface UserRepo extends JpaRepository<User, Long> {
    
    /**
     * Finds a user by their email address.
     * 
     * @param email The email address to search for
     * @return Optional containing the user, or empty if not found
     */
    Optional<User> findByEmail(String email);
}
