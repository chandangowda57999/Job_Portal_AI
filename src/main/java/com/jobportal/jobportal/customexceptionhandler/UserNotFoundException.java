package com.jobportal.jobportal.customexceptionhandler;

public class UserNotFoundException extends RuntimeException {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private final Long userId;
    private final String email;

    public UserNotFoundException(Long userId) {
        super("User not found with id: " + userId);
        this.userId = userId;
        this.email = null;
    }

    public UserNotFoundException(String email) {
        super("User not found with email: " + email);
        this.email = email;
        this.userId = null;
    }

    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }
}
