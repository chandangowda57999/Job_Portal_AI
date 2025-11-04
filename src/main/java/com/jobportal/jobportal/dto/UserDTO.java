package com.jobportal.jobportal.dto;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Data Transfer Object (DTO) for User entity.
 * Used for transferring user data between layers without exposing entity details.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    
    /** Unique identifier for the user */
    private Long id;
    
    /** User's first name */
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 120, message = "First name must be between 2 and 120 characters")
    @Pattern(regexp = "^[a-zA-Z\\s'-]+$", message = "First name can only contain letters, spaces, hyphens, and apostrophes")
    private String firstName;
    
    /** User's last name (optional, but must be valid if provided) */
    @Size(min = 2, max = 120, message = "Last name must be between 2 and 120 characters")
    @Pattern(regexp = "^[a-zA-Z\\s'-]*$", message = "Last name can only contain letters, spaces, hyphens, and apostrophes")
    private String lastName;
    
    /** User's email address (unique) */
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    @Size(max = 190, message = "Email must not exceed 190 characters")
    private String email;
    
    /** User's phone number */
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone number must be between 10 and 15 digits")
    private String phoneNumber;
    
    /** Country code for phone number */
    @Pattern(regexp = "^\\+?[1-9]\\d{0,3}$", message = "Country code must be a valid format (e.g., +1, +91)")
    private String phoneCountryCode;
    
    /** Type of user (candidate/employer/admin) */
    @NotBlank(message = "User type is required")
    @Pattern(regexp = "^(candidate|employer|admin)$", message = "User type must be either 'candidate', 'employer', or 'admin'")
    private String userType;
}



