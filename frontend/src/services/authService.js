import axios from 'axios';
import {
  API_BASE_URL,
  API_ENDPOINTS,
  GOOGLE_OAUTH,
  LINKEDIN_OAUTH,
  STORAGE_KEYS,
  UI_CONSTANTS
} from '../utils/constants';

/**
 * Authentication Service
 * Handles all authentication-related operations including OAuth and traditional login
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
    throw new Error(
      error.response?.data?.message ||
      UI_CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS
    );
  }
};

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
    throw new Error(
      error.response?.data?.message ||
      UI_CONSTANTS.ERROR_MESSAGES.SERVER_ERROR
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
 * Initiates Google OAuth flow
 * Redirects user to Google's authentication page
 * 
 * @example
 * // Redirect to Google OAuth
 * initiateGoogleLogin();
 */
export const initiateGoogleLogin = () => {
  // Construct Google OAuth URL
  const params = new URLSearchParams({
    client_id: GOOGLE_OAUTH.CLIENT_ID,
    redirect_uri: GOOGLE_OAUTH.REDIRECT_URI,
    response_type: 'code',
    scope: GOOGLE_OAUTH.SCOPE,
    access_type: 'offline',
    prompt: 'consent',
  });

  const authUrl = `${GOOGLE_OAUTH.AUTH_URL}?${params.toString()}`;
  
  // Redirect to Google's OAuth page
  window.location.href = authUrl;
};

/**
 * Handles Google OAuth callback
 * Exchanges authorization code for access token and user data
 * 
 * @param {string} code - Authorization code from Google OAuth
 * @returns {Promise<Object>} Promise resolving to user data and token
 * @throws {Error} If OAuth callback handling fails
 * 
 * @example
 * // In callback component
 * const code = new URLSearchParams(window.location.search).get('code');
 * try {
 *   const response = await handleGoogleCallback(code);
 * } catch (error) {
 *   console.error('Google auth failed:', error);
 * }
 */
export const handleGoogleCallback = async (code) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.GOOGLE_CALLBACK, {
      code,
      redirect_uri: GOOGLE_OAUTH.REDIRECT_URI,
    });

    const { token, user } = response.data;

    // Store authentication data
    setAuthToken(token);
    setUserData(user);

    return {
      success: true,
      message: UI_CONSTANTS.SUCCESS_MESSAGES.LOGIN,
      user,
      token,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      UI_CONSTANTS.ERROR_MESSAGES.OAUTH_FAILED
    );
  }
};

/**
 * Initiates LinkedIn OAuth flow
 * Redirects user to LinkedIn's authentication page
 * 
 * @example
 * // Redirect to LinkedIn OAuth
 * initiateLinkedInLogin();
 */
export const initiateLinkedInLogin = () => {
  // Construct LinkedIn OAuth URL
  const params = new URLSearchParams({
    client_id: LINKEDIN_OAUTH.CLIENT_ID,
    redirect_uri: LINKEDIN_OAUTH.REDIRECT_URI,
    response_type: 'code',
    scope: LINKEDIN_OAUTH.SCOPE,
  });

  const authUrl = `${LINKEDIN_OAUTH.AUTH_URL}?${params.toString()}`;
  
  // Redirect to LinkedIn's OAuth page
  window.location.href = authUrl;
};

/**
 * Handles LinkedIn OAuth callback
 * Exchanges authorization code for access token and user data
 * 
 * @param {string} code - Authorization code from LinkedIn OAuth
 * @returns {Promise<Object>} Promise resolving to user data and token
 * @throws {Error} If OAuth callback handling fails
 * 
 * @example
 * // In callback component
 * const code = new URLSearchParams(window.location.search).get('code');
 * try {
 *   const response = await handleLinkedInCallback(code);
 * } catch (error) {
 *   console.error('LinkedIn auth failed:', error);
 * }
 */
export const handleLinkedInCallback = async (code) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LINKEDIN_CALLBACK, {
      code,
      redirect_uri: LINKEDIN_OAUTH.REDIRECT_URI,
    });

    const { token, user } = response.data;

    // Store authentication data
    setAuthToken(token);
    setUserData(user);

    return {
      success: true,
      message: UI_CONSTANTS.SUCCESS_MESSAGES.LOGIN,
      user,
      token,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      UI_CONSTANTS.ERROR_MESSAGES.OAUTH_FAILED
    );
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
 * Export the configured API client for use in other services
 */
export default apiClient;

