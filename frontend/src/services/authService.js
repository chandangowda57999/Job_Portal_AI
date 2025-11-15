import axios from 'axios';
import {
  API_BASE_URL,
  API_ENDPOINTS,
  STORAGE_KEYS,
  UI_CONSTANTS
} from '../utils/constants';
// Mock mode removed - using real API only

/**
 * Authentication Service
 * Handles all authentication-related operations
 */

/**
 * Axios instance configured with base URL and interceptors
 * Automatically includes auth token in requests
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

/**
 * Request interceptor to add authentication token
 * Automatically attaches JWT token to outgoing requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle common error scenarios
 * Handles token expiration and network errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      clearAuthData();
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

/**
 * Retrieves the authentication token from local storage
 * 
 * @returns {string|null} The authentication token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Stores the authentication token in local storage
 * 
 * @param {string} token - The authentication token to store
 */
export const setAuthToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

/**
 * Retrieves user data from local storage
 * 
 * @returns {Object|null} The user data object or null if not found
 */
export const getUserData = () => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Stores user data in local storage
 * 
 * @param {Object} userData - The user data object to store
 */
export const setUserData = (userData) => {
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
};

/**
 * Clears all authentication data from local storage
 * Used during logout or when token is invalid
 */
export const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
};

/**
 * Checks if user is currently authenticated
 * 
 * @returns {boolean} True if user has a valid token, false otherwise
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Mock login function removed - using real API only

/**
 * Traditional email/password login
 * Sends credentials to backend and stores received token
 * 
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email address
 * @param {string} credentials.password - User's password
 * @param {boolean} [credentials.rememberMe=false] - Whether to remember the user
 * @returns {Promise<Object>} Promise resolving to user data and token
 * @throws {Error} If login fails or credentials are invalid
 * 
 * @example
 * try {
 *   const response = await login({ email: 'user@example.com', password: 'pass123' });
 *   console.log('Logged in:', response.user);
 * } catch (error) {
 *   console.error('Login failed:', error.message);
 * }
 */
export const login = async ({ email, password, rememberMe = false }) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    const { token, user } = response.data;

    // Store authentication data
    setAuthToken(token);
    setUserData(user);

    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
    }

    return {
      success: true,
      message: UI_CONSTANTS.SUCCESS_MESSAGES.LOGIN,
      user,
      token,
    };
  } catch (error) {
    // Preserve the error object to access response data
    if (error.response) {
      // Backend returned an error response
      // For login, always return generic message for security
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error ||
                          UI_CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS;
      const apiError = new Error(errorMessage);
      apiError.response = error.response; // Preserve response for detailed error handling
      throw apiError;
    }
    // Network or other errors
    throw new Error(
      error.message ||
      UI_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR
    );
  }
};

// Mock registration function removed - using real API only

/**
 * User registration
 * Creates a new user account with provided credentials
 * 
 * @param {Object} userData - Registration data
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @param {string} userData.name - User's full name
 * @returns {Promise<Object>} Promise resolving to user data and token
 * @throws {Error} If registration fails or email already exists
 * 
 * @example
 * try {
 *   const response = await register({
 *     email: 'newuser@example.com',
 *     password: 'SecurePass123!',
 *     name: 'John Doe'
 *   });
 * } catch (error) {
 *   console.error('Registration failed:', error.message);
 * }
 */
export const register = async (userData) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);

    const { token, user } = response.data;

    // Store authentication data
    setAuthToken(token);
    setUserData(user);

    return {
      success: true,
      message: UI_CONSTANTS.SUCCESS_MESSAGES.REGISTER,
      user,
      token,
    };
  } catch (error) {
    // Preserve the error object to access response data
    if (error.response) {
      // Backend returned an error response
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error ||
                          UI_CONSTANTS.ERROR_MESSAGES.SERVER_ERROR;
      const apiError = new Error(errorMessage);
      apiError.response = error.response; // Preserve response for detailed error handling
      throw apiError;
    }
    // Network or other errors
    throw new Error(
      error.message ||
      UI_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR
    );
  }
};

/**
 * Logs out the current user
 * Clears all stored authentication data
 * 
 * @returns {Promise<Object>} Promise resolving to logout success message
 */
export const logout = async () => {
  try {
    // Optionally call backend logout endpoint
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    // Continue with logout even if backend call fails
    console.error('Logout API call failed:', error);
  } finally {
    // Always clear local storage
    clearAuthData();
    return {
      success: true,
      message: UI_CONSTANTS.SUCCESS_MESSAGES.LOGOUT,
    };
  }
};

/**
 * Fetches the current user's profile
 * 
 * @returns {Promise<Object>} Promise resolving to user profile data
 * @throws {Error} If profile fetch fails
 */
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.USERS.GET_PROFILE);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      'Failed to fetch user profile'
    );
  }
};

/**
 * Checks if user profile is complete
 * Profile is considered complete if firstName, lastName, and userType are set
 * 
 * @param {Object} user - User object from storage or API
 * @returns {boolean} True if profile is complete, false otherwise
 */
export const isProfileComplete = (user) => {
  if (!user) return false;
  
  // Check if required profile fields exist
  const hasFirstName = user.firstName && user.firstName.trim().length > 0;
  const hasLastName = user.lastName && user.lastName.trim().length > 0;
  const hasUserType = user.userType && user.userType.trim().length > 0;
  
  return hasFirstName && hasLastName && hasUserType;
};

/**
 * Export the configured API client for use in other services
 */
export default apiClient;

