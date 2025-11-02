/**
 * Application Configuration
 * Centralized configuration for app behavior and feature flags
 * 
 * ============================================
 * TRANSITIONING FROM MOCK MODE TO REAL DATABASE
 * ============================================
 * 
 * When your database is ready, simply follow these steps:
 * 
 * 1. Add to your .env file:
 *    VITE_ENABLE_MOCK_MODE=false
 * 
 * 2. Ensure your backend API is running and accessible
 * 
 * 3. Update API_BASE_URL in frontend/src/utils/constants.js if needed
 * 
 * That's it! No other code changes required.
 * The app will automatically use real API calls only.
 * 
 * ============================================
 * 
 * Mock mode is completely isolated:
 * - All mock code is in frontend/src/services/mockUsers.js
 * - Mock functions are only called when ENABLE_MOCK_MODE=true
 * - When disabled, mock code is never executed
 * - You can safely delete mockUsers.js later if desired
 */

/**
 * Application Configuration Object
 * Controls app-wide settings and feature flags
 */
export const appConfig = {
  /**
   * Enable/Disable Mock Mode
   * 
   * When set to false, the app will only use real API calls.
   * Mock mode will not be used even if backend is unavailable.
   * 
   * Set this to false when database is ready and you want to use
   * only real backend API.
   * 
   * @type {boolean}
   * @default true (for development without database)
   */
  ENABLE_MOCK_MODE: import.meta.env.VITE_ENABLE_MOCK_MODE !== 'false', // Default true, set to 'false' in .env to disable

  /**
   * Show Test Credentials Component
   * Only shown in development mode and when mock mode is enabled
   * 
   * @type {boolean}
   */
  SHOW_TEST_CREDENTIALS: import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK_MODE !== 'false',

  /**
   * Print Test Credentials to Console
   * Automatically prints test credentials in development mode
   * 
   * @type {boolean}
   */
  PRINT_TEST_CREDENTIALS: import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK_MODE !== 'false',
};

/**
 * Checks if mock mode should be used for a given error
 * 
 * @param {Error} error - API error object
 * @returns {boolean} True if mock mode should be used, false otherwise
 */
export const shouldUseMockMode = (error) => {
  // Don't use mock mode if it's disabled
  if (!appConfig.ENABLE_MOCK_MODE) {
    return false;
  }

  // Use mock mode for network errors or connection refused
  return (
    error?.code === 'ERR_NETWORK' ||
    error?.code === 'ECONNREFUSED' ||
    !error?.response
  );
};

/**
 * Checks if backend is available
 * Makes a health check request to determine backend availability
 * 
 * @returns {Promise<boolean>} True if backend is available, false otherwise
 */
export const checkBackendAvailability = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/health`, {
      method: 'GET',
      timeout: 3000,
    });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Export default configuration
 */
export default appConfig;

