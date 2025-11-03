/**
 * Mock Users Service
 * Provides test users for development and testing without a database
 * 
 * ============================================
 * NOTE: This file can be safely removed when database is ready
 * ============================================
 * 
 * This module is only used when:
 * - ENABLE_MOCK_MODE=true (in appConfig.js)
 * - Backend API is unavailable (network errors)
 * 
 * When transitioning to real database:
 * 1. Set VITE_ENABLE_MOCK_MODE=false in .env
 * 2. This file will no longer be imported/used
 * 3. You can optionally delete this file after verification
 * 
 * ============================================
 * 
 * This module contains predefined mock users with different profile states:
 * - Complete profiles (ready for dashboard)
 * - Incomplete profiles (need profile creation)
 * - Various user types (candidate, employer)
 * 
 * Test credentials are available for all users in this file.
 */

/**
 * Mock Users Database (in-memory storage)
 * Stores user data for testing authentication flows
 */
const mockUsersDB = {
  // User with complete profile - will go directly to dashboard
  'test@jobportal.com': {
    id: 'mock_user_complete_001',
    email: 'test@jobportal.com',
    name: 'Test User',
    password: 'Test@123', // For reference - not actually used in mock mode
    firstName: 'John',
    lastName: 'Doe',
    phoneCountryCode: '+1',
    phoneNumber: '1234567890',
    userType: 'candidate',
    profileComplete: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  
  // User with incomplete profile - will redirect to profile creation
  'incomplete@jobportal.com': {
    id: 'mock_user_incomplete_001',
    email: 'incomplete@jobportal.com',
    name: 'Incomplete User',
    password: 'Test@123',
    firstName: null,
    lastName: null,
    phoneCountryCode: null,
    phoneNumber: null,
    userType: null,
    profileComplete: false,
    createdAt: '2024-01-15T11:00:00Z',
  },
  
  // Employer user with complete profile
  'employer@jobportal.com': {
    id: 'mock_user_employer_001',
    email: 'employer@jobportal.com',
    name: 'Company HR',
    password: 'Test@123',
    firstName: 'Jane',
    lastName: 'Smith',
    phoneCountryCode: '+1',
    phoneNumber: '9876543210',
    userType: 'employer',
    profileComplete: true,
    createdAt: '2024-01-15T12:00:00Z',
  },
  
  // Candidate user ready for testing
  'candidate@jobportal.com': {
    id: 'mock_user_candidate_001',
    email: 'candidate@jobportal.com',
    name: 'Job Seeker',
    password: 'Test@123',
    firstName: 'Alice',
    lastName: 'Johnson',
    phoneCountryCode: '+44',
    phoneNumber: '5551234567',
    userType: 'candidate',
    profileComplete: true,
    createdAt: '2024-01-15T13:00:00Z',
  },
};

/**
 * Mock token generator
 * Creates consistent mock tokens for testing
 * 
 * @param {string} userId - User ID to generate token for
 * @returns {string} Mock authentication token
 */
const generateMockToken = (userId) => {
  return `mock_token_${userId}_${Date.now()}`;
};

/**
 * Finds a user by email in the mock database
 * 
 * @param {string} email - User's email address
 * @returns {Object|null} User object if found, null otherwise
 */
export const findMockUserByEmail = (email) => {
  return mockUsersDB[email.toLowerCase()] || null;
};

/**
 * Creates a new mock user
 * Stores user in the mock database and returns user object
 * 
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User's email
 * @param {string} userData.name - User's full name
 * @returns {Object} Created user object with generated ID
 */
export const createMockUser = (userData) => {
  const userId = `mock_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const newUser = {
    id: userId,
    email: userData.email.toLowerCase(),
    name: userData.name,
    password: userData.password, // Stored for reference
    firstName: null,
    lastName: null,
    phoneCountryCode: null,
    phoneNumber: null,
    userType: null,
    profileComplete: false,
    createdAt: new Date().toISOString(),
  };
  
  // Store in mock database
  mockUsersDB[newUser.email] = newUser;
  
  return newUser;
};

/**
 * Updates an existing mock user's profile
 * 
 * @param {string} email - User's email
 * @param {Object} profileData - Profile data to update
 * @returns {Object|null} Updated user object or null if not found
 */
export const updateMockUserProfile = (email, profileData) => {
  const user = mockUsersDB[email.toLowerCase()];
  
  if (!user) {
    return null;
  }
  
  // Update user profile
  const updatedUser = {
    ...user,
    ...profileData,
    profileComplete: !!(profileData.firstName && profileData.lastName && profileData.userType),
  };
  
  // Save back to database
  mockUsersDB[email.toLowerCase()] = updatedUser;
  
  return updatedUser;
};

/**
 * Authenticates a user with email and password (mock)
 * 
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object|null} User object if credentials match, null otherwise
 */
export const authenticateMockUser = (email, password) => {
  const user = findMockUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  // In mock mode, we check if password matches (for testing)
  // For predefined users, password is 'Test@123'
  // For newly created users, any password works initially
  if (user.password && user.password !== password) {
    return null;
  }
  
  return user;
};

/**
 * Gets mock token for a user
 * 
 * @param {string} userId - User ID
 * @returns {string} Mock authentication token
 */
export const getMockToken = (userId) => {
  return generateMockToken(userId);
};

/**
 * Test Credentials for Mock Users
 * Use these credentials to test different scenarios
 * 
 * EXPORTED FOR EASY ACCESS - Copy these for testing
 */
export const TEST_CREDENTIALS = {
  // Complete Profile - Direct Dashboard Access
  COMPLETE_PROFILE: {
    email: 'test@jobportal.com',
    password: 'Test@123',
    description: 'User with complete profile - goes directly to dashboard after sign in',
    profileStatus: 'Complete',
  },
  
  // Incomplete Profile - Redirects to Profile Creation
  INCOMPLETE_PROFILE: {
    email: 'incomplete@jobportal.com',
    password: 'Test@123',
    description: 'User with incomplete profile - redirects to profile creation',
    profileStatus: 'Incomplete',
  },
  
  // Employer User
  EMPLOYER: {
    email: 'employer@jobportal.com',
    password: 'Test@123',
    description: 'Employer user with complete profile',
    profileStatus: 'Complete',
  },
  
  // Candidate User
  CANDIDATE: {
    email: 'candidate@jobportal.com',
    password: 'Test@123',
    description: 'Candidate user with complete profile',
    profileStatus: 'Complete',
  },
};

/**
 * Helper function to get all test credentials
 * Useful for displaying in console or documentation
 * 
 * @returns {Object} Object containing all test credentials
 */
export const getAllTestCredentials = () => {
  return {
    message: '📋 Mock Test Credentials',
    note: 'Use these credentials to test different user scenarios',
    credentials: TEST_CREDENTIALS,
    instructions: [
      '1. Complete Profile: Sign in → Goes directly to Dashboard',
      '2. Incomplete Profile: Sign in → Redirects to Profile Creation',
      '3. New User: Sign up → Redirects to Profile Creation',
      '4. All passwords: Test@123',
    ],
  };
};

/**
 * Prints test credentials to console
 * Useful for development and debugging
 */
export const printTestCredentials = () => {
  const info = getAllTestCredentials();
  console.group('🔧 Mock Mode - Test Credentials');
  console.log(info.message);
  console.log('');
  console.log('📝 Available Test Accounts:');
  Object.entries(info.credentials).forEach(([key, cred]) => {
    console.log(`\n  ${key}:`);
    console.log(`    Email: ${cred.email}`);
    console.log(`    Password: ${cred.password}`);
    console.log(`    Status: ${cred.profileStatus}`);
    console.log(`    Description: ${cred.description}`);
  });
  console.log('');
  console.log('📋 Test Scenarios:');
  info.instructions.forEach(instruction => console.log(`  ${instruction}`));
  console.groupEnd();
};

// Export the mock database for advanced testing (if needed)
export default {
  mockUsersDB,
  findMockUserByEmail,
  createMockUser,
  updateMockUserProfile,
  authenticateMockUser,
  getMockToken,
  TEST_CREDENTIALS,
  getAllTestCredentials,
  printTestCredentials,
};

