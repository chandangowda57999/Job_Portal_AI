package com.jobportal.jobportal.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data Transfer Object for API token requests.
 * Contains API secret for token generation.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApiTokenRequest {
    
    /** JWT secret (must match jwt.secret from properties) */
    @NotBlank(message = "Secret is required")
    private String secret;
}

