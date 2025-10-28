package com.jobportal.jobportal.customexceptionhandler;

/**
 * Custom exception for business logic validation errors.
 * Used when validation cannot be expressed through standard annotations.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
public class ValidationException extends RuntimeException {
    
    /**
     * Constructor with error message.
     * 
     * @param message The validation error message
     */
    public ValidationException(String message) {
        super(message);
    }
    
    /**
     * Constructor with error message and cause.
     * 
     * @param message The validation error message
     * @param cause The underlying cause
     */
    public ValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}

