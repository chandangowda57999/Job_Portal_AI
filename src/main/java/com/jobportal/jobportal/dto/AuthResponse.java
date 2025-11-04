package com.jobportal.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data Transfer Object for authentication responses.
 * Contains JWT token and user information after successful login or registration.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    /** JWT authentication token */
    private String token;
    
    /** User information (without password) */
    private UserDTO user;
    
    /** Success message */
    private String message;
}
