import { API_BASE_URL } from '../utils/constants';
import apiClient, { getAuthToken } from './authService';

/**
 * Dashboard Service
 * Handles all API calls related to dashboard data
 */

/**
 * Fetch all active jobs
 * @returns {Promise<Array>} List of active jobs
 */
export const fetchActiveJobs = async () => {
  try {
    const response = await apiClient.get('/v1/job/active');

    return response.data;
  } catch (error) {
    console.error('Error fetching active jobs:', error);
    throw error;
  }
};

/**
 * Fetch all jobs
 * @returns {Promise<Array>} List of all jobs
 */
export const fetchAllJobs = async () => {
  try {
    const response = await apiClient.get('/v1/job');
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

/**
 * Fetch jobs by company
 * @param {string} company - Company name
 * @returns {Promise<Array>} List of jobs for the company
 */
export const fetchJobsByCompany = async (company) => {
  try {
    const response = await apiClient.get(`/v1/job/company/${encodeURIComponent(company)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs by company:', error);
    throw error;
  }
};

/**
 * Fetch job detail by ID
 * @param {string|number} jobId - Job ID
 * @param {number} userId - Optional user ID for match score calculation
 * @returns {Promise<Object>} Job detail with match score and similar jobs
 */
export const fetchJobDetail = async (jobId, userId = null) => {
  try {
    const url = userId 
      ? `/v1/job/${jobId}/detail?userId=${userId}`
      : `/v1/job/${jobId}/detail`;
    
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching job detail:', error);
    
    // Extract meaningful error message from axios error
    let errorMessage = 'Failed to load job details. Please try again later.';
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 404) {
        errorMessage = 'Job not found.';
      } else if (status === 403) {
        errorMessage = 'Access denied. Please check your authentication.';
      } else if (status === 401) {
        errorMessage = 'Authentication required. Please log in.';
      } else if (data?.message) {
        errorMessage = data.message;
      } else if (data?.error) {
        errorMessage = data.error;
      } else {
        errorMessage = `Failed to fetch job detail: ${error.response.statusText || status}`;
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'Network error. Please check your connection.';
    } else {
      // Error setting up the request
      errorMessage = error.message || errorMessage;
    }
    
    const apiError = new Error(errorMessage);
    apiError.response = error.response;
    throw apiError;
  }
};

/**
 * Fetch user profile
 * @param {number} userId - User ID
 * @returns {Promise<Object>} User profile data
 */
export const fetchUserProfile = async (userId) => {
  try {
    const response = await apiClient.get(`/v1/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Calculate job match percentage (mock for now, can be enhanced with AI)
 * @param {Object} job - Job object
 * @param {Object} userProfile - User profile object
 * @returns {number} Match percentage
 */
export const calculateJobMatch = (job, userProfile) => {
  // Mock calculation - can be enhanced with actual matching algorithm
  // Based on skills, experience level, location, work mode, etc.
  let match = 70; // Base match

  if (userProfile?.userType === 'candidate') {
    match += 10;
  }

  if (job.workMode === 'REMOTE') {
    match += 5;
  }

  // Add more sophisticated matching logic here
  return Math.min(100, Math.max(0, match));
};

/**
 * Format job type enum to readable string
 * @param {string} jobType - Job type enum (FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP)
 * @returns {string} Formatted job type (Full-time, Part-time, Contract, Internship)
 */
const formatJobType = (jobType) => {
  if (!jobType) return 'Not specified';
  const typeMap = {
    'FULL_TIME': 'Full-time',
    'PART_TIME': 'Part-time',
    'CONTRACT': 'Contract',
    'INTERNSHIP': 'Internship',
  };
  return typeMap[jobType] || jobType;
};

/**
 * Format salary range to simplified format ($, $$, $$$)
 * @param {number} salaryMin - Minimum salary
 * @param {number} salaryMax - Maximum salary
 * @param {string} currency - Currency code (USD, EUR, etc.)
 * @returns {string} Formatted salary ($, $$, $$$)
 */
const formatSalary = (salaryMin, salaryMax, currency = 'USD') => {
  if (!salaryMin || !salaryMax) return '$';
  
  // Average salary for categorization
  const avgSalary = (salaryMin + salaryMax) / 2;
  
  // Convert to USD if needed (simplified - in production, use actual exchange rates)
  let usdSalary = avgSalary;
  if (currency === 'EUR') {
    usdSalary = avgSalary * 1.1; // Approximate conversion
  } else if (currency === 'INR') {
    usdSalary = avgSalary / 83; // Approximate conversion
  }
  
  // Categorize by salary range
  if (usdSalary < 80000) return '$';
  if (usdSalary < 150000) return '$$';
  return '$$$';
};

/**
 * Generate badges for job (Remote, Urgent, etc.)
 * @param {Object} job - Job object
 * @returns {string[]} Array of badge strings
 */
const generateBadges = (job) => {
  const badges = [];
  
  // Remote badge
  if (job.workMode === 'REMOTE') {
    badges.push('Remote');
  }
  
  // Urgent badge (if posted within last 3 days)
  if (job.createdAt) {
    const createdAt = new Date(job.createdAt);
    const now = new Date();
    const daysSincePosted = (now - createdAt) / (1000 * 60 * 60 * 24);
    if (daysSincePosted <= 3) {
      badges.push('Urgent');
    }
  }
  
  return badges;
};

/**
 * Transform backend job data to search page format
 * @param {Object} job - Job from backend (JobDTO)
 * @returns {Object} Transformed job for search page
 */
export const transformJobForSearch = (job) => {
  return {
    id: job.id?.toString() || '',
    role: job.title || 'Unknown Role',
    company: job.company || 'Unknown Company',
    location: job.location || 'Not specified',
    salary: formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency),
    type: formatJobType(job.jobType),
    badges: generateBadges(job),
    // Keep additional fields for future use
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    salaryCurrency: job.salaryCurrency || 'USD',
    jobType: job.jobType,
    workMode: job.workMode,
    experienceLevel: job.experienceLevel,
    description: job.description,
    requirements: job.requirements,
    createdAt: job.createdAt,
    applicationDeadline: job.applicationDeadline,
  };
};

/**
 * Transform backend job data to dashboard format
 * @param {Object} job - Job from backend
 * @param {Object} userProfile - User profile for matching
 * @returns {Object} Transformed job for dashboard
 */
export const transformJobForDashboard = (job, userProfile) => {
  const match = calculateJobMatch(job, userProfile);

  return {
    id: job.id.toString(),
    company: job.company || 'Unknown Company',
    role: job.title || 'Unknown Role',
    match: match,
    location: job.location || 'Not specified',
    workMode: job.workMode || 'Not specified',
    level: job.experienceLevel || 'Not specified',
    experience: job.experienceLevel ? `${job.experienceLevel} level` : 'Not specified',
    applications: 0, // This would come from applications endpoint when available
    description: job.description || '',
    requirements: job.requirements || '',
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    salaryCurrency: job.salaryCurrency || 'USD',
    jobType: job.jobType,
    status: job.status,
    postedBy: job.postedBy,
    createdAt: job.createdAt,
    applicationDeadline: job.applicationDeadline,
  };
};

/**
 * Fetch dashboard data
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Dashboard data including stats and recommendations
 */
export const fetchDashboardData = async (userId) => {
  try {
    // Fetch user profile
    const userProfile = await fetchUserProfile(userId);

    // Fetch active jobs
    const activeJobs = await fetchActiveJobs();

    // Transform jobs for dashboard
    const recommendations = activeJobs
      .map((job) => transformJobForDashboard(job, userProfile))
      .sort((a, b) => b.match - a.match) // Sort by match percentage
      .slice(0, 12); // Limit to 12 recommendations

    // Calculate stats
    const totalJobs = activeJobs.length;
    const appliedCount = 0; // TODO: Get from applications endpoint when available
    const savedCount = 0; // TODO: Get from saved jobs endpoint when available
    const interviewsCount = 0; // TODO: Get from interviews endpoint when available

    return {
      stats: [
        { label: 'Matches', value: recommendations.length },
        { label: 'Applied', value: appliedCount },
        { label: 'Interviews', value: interviewsCount },
        { label: 'Saved', value: savedCount },
      ],
      recommendations,
      totalJobs,
      userProfile,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};
