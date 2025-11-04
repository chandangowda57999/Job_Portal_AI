package com.jobportal.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;

/**
 * JPA Entity representing a User in the database.
 * Stores user information and maintains relationship with Resume entities.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    /** Primary key - auto-generated unique identifier */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** User's email address - must be unique */
    @Column(nullable = false, unique = true, length = 190)
    private String email;

    /** User's password (hashed) */
    @Column(nullable = false, length = 255)
    private String password;

    /** User's first name */
    @Column(nullable = false, length = 120)
    private String firstName;

    /** User's last name */
    @Column(nullable = false, length = 120)
    private String lastName;

    /** Country code for phone number */
    private String phoneCountryCode;
    
    /** User's phone number */
    private String phoneNumber;
    
    /** Type of user - candidate, employer, or admin */
    private String userType;  // candidate/employer/admin

    /** One-to-Many relationship with Resume entities */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Resume> resumes;

    /** Timestamp when the user was created (immutable) */
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    /** Timestamp when the user was last updated */
    private Instant updatedAt;

    /**
     * JPA callback method executed before persisting a new entity.
     * Sets creation and update timestamps.
     */
    @PrePersist
    public void onCreate() {
        var now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    /**
     * JPA callback method executed before updating an existing entity.
     * Updates the modification timestamp.
     */
    @PreUpdate
    public void onUpdate() {
        updatedAt = Instant.now();
    }
}