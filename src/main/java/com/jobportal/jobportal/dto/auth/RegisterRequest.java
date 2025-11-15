package com.jobportal.jobportal.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data Transfer Object for user registration requests.
 * Contains name, email, and password for new user creation.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    
    /** User's full name - will be split into firstName and lastName */
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 240, message = "Name must be between 2 and 240 characters")
    @Pattern(regexp = "^[a-zA-Z\\s'-]+$", message = "Name can only contain letters, spaces, hyphens, and apostrophes")
    private String name;
    
    /** User's email address */
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    @Size(max = 190, message = "Email must not exceed 190 characters")
    private String email;
    
    /** User's password - must be at least 8 characters and contain at least one letter */
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = ".*[a-zA-Z].*", message = "Password must contain at least one letter")
    private String password;
}
