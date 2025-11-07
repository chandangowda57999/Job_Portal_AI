import { API_BASE_URL } from '../utils/constants';

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
    const response = await fetch(`${API_BASE_URL}/v1/job/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch active jobs: ${response.statusText}`);
    }

    return await response.json();
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
    const response = await fetch(`${API_BASE_URL}/v1/job`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }

    return await response.json();
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
    const response = await fetch(`${API_BASE_URL}/v1/job/company/${encodeURIComponent(company)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs by company: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching jobs by company:', error);
    throw error;
  }
};

/**
 * Fetch user profile
 * @param {number} userId - User ID
 * @returns {Promise<Object>} User profile data
 */
export const fetchUserProfile = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    return await response.json();
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
