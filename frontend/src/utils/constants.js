/**
 * Application-wide constants
 * Centralized configuration for API endpoints and validation rules
 * 
 * NOTE: When transitioning from mock mode to real database:
 * - Update VITE_API_BASE_URL in .env file to point to your backend
 * - Example: VITE_API_BASE_URL=http://localhost:8080/api
 * - This constant automatically uses the environment variable
 */

/**
 * API Base URL from environment variables
 * Falls back to localhost if not configured
 * 
 * To configure: Set VITE_API_BASE_URL in .env file
 * Example: VITE_API_BASE_URL=http://localhost:8080/api
 */
// Use proxy in development (vite.config.js proxies /api to http://localhost:8081)
// In production, use absolute URL from environment variable
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:8081/api');

/**
 * API Endpoints
 * Centralized definition of all backend API endpoints
 */
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout'
  },
  // User management endpoints
  USERS: {
    GET_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    DELETE_ACCOUNT: '/users/account'
  },
  // Job endpoints
  JOBS: {
    GET_ALL: '/jobs',
    GET_BY_ID: (id) => `/jobs/${id}`,
    CREATE: '/jobs',
    UPDATE: (id) => `/jobs/${id}`,
    DELETE: (id) => `/jobs/${id}`
  }
};

/**
 * Form Validation Rules
 * Regex patterns and validation constraints for form inputs
 */
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Please enter a valid email address'
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /.*[a-zA-Z].*/, // Must contain at least one letter
    MESSAGE: 'Password must be at least 8 characters and contain at least one letter'
  }
};

/**
 * UI Constants
 * Common UI-related constants like messages, timeouts, and labels
 */
export const UI_CONSTANTS = {
  // Success messages
  SUCCESS_MESSAGES: {
    LOGIN: 'Successfully logged in!',
    REGISTER: 'Account created successfully!',
    LOGOUT: 'Logged out successfully'
  },
  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    INVALID_CREDENTIALS: 'Invalid email or password',
    SERVER_ERROR: 'Server error. Please try again later.'
  },
  // Loading states
  LOADING_MESSAGES: {
    SIGNING_IN: 'Signing in...',
    PROCESSING: 'Processing...'
  }
};

/**
 * Local Storage Keys
 * Standardized keys for browser local storage
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'jobportal_auth_token',
  USER_DATA: 'jobportal_user_data',
  REMEMBER_ME: 'jobportal_remember_me'
};

