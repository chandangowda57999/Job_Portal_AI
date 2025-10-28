package com.jobportal.jobportal.dto;

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
@Builder
public class UserDTO {
    
    /** Unique identifier for the user */
    private Long id;
    
    /** User's first name */
    private String firstName;
    
    /** User's last name */
    private String lastName;
    
    /** User's email address (unique) */
    private String email;
    
    /** User's phone number */
    private String phoneNumber;
    
    /** Country code for phone number */
    private String phoneCountryCode;
    
    /** Type of user (candidate/employer/admin) */
    private String userType;
}



