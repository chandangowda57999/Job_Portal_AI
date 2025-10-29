import { VALIDATION_RULES } from './constants';

/**
 * Validation Utility Functions
 * Reusable validation functions for form inputs and data
 */

/**
 * Validates an email address format
 * 
 * @param {string} email - The email address to validate
 * @returns {Object} Validation result with isValid flag and error message
 * @example
 * validateEmail('user@example.com') // { isValid: true, error: null }
 * validateEmail('invalid-email') // { isValid: false, error: 'Please enter a valid email address' }
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
    return {
      isValid: false,
      error: VALIDATION_RULES.EMAIL.MESSAGE
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates a password against security requirements
 * 
 * @param {string} password - The password to validate
 * @returns {Object} Validation result with isValid flag and error message
 * @example
 * validatePassword('SecurePass123!') // { isValid: true, error: null }
 * validatePassword('weak') // { isValid: false, error: 'Password must be at least...' }
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return {
      isValid: false,
      error: 'Password is required'
    };
  }

  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters long`
    };
  }

  if (!VALIDATION_RULES.PASSWORD.PATTERN.test(password)) {
    return {
      isValid: false,
      error: VALIDATION_RULES.PASSWORD.MESSAGE
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates the entire sign-in form
 * 
 * @param {Object} formData - Object containing email and password
 * @param {string} formData.email - User's email address
 * @param {string} formData.password - User's password
 * @returns {Object} Validation result with isValid flag and field-specific errors
 * @example
 * validateSignInForm({ email: 'user@example.com', password: 'SecurePass123!' })
 * // { isValid: true, errors: {} }
 */
export const validateSignInForm = (formData) => {
  const errors = {};
  
  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  // Validate password (basic check for sign-in, not strict)
  if (!formData.password || formData.password.trim() === '') {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates the sign-up form with stricter password requirements
 * 
 * @param {Object} formData - Object containing user registration data
 * @param {string} formData.email - User's email address
 * @param {string} formData.password - User's password
 * @param {string} formData.confirmPassword - Password confirmation
 * @returns {Object} Validation result with isValid flag and field-specific errors
 */
export const validateSignUpForm = (formData) => {
  const errors = {};
  
  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  // Validate password with strict rules
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  // Validate password confirmation
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sanitizes user input by removing potentially harmful characters
 * 
 * @param {string} input - The input string to sanitize
 * @returns {string} Sanitized input string
 * @example
 * sanitizeInput('<script>alert("xss")</script>') // Returns sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent basic XSS
    .slice(0, 255); // Limit length
};

